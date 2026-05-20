const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Gemini Setup (Primary) ──────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ─── Multer — max 10MB ────────────────────────────────────────────────────────
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ─── Language code map (for MyMemory fallback) ───────────────────────────────
const LANG_CODE_MAP = {
  'Auto Detect': 'en', 'auto': 'en',
  'English': 'en', 'Hindi': 'hi', 'Spanish': 'es',
  'French': 'fr', 'German': 'de', 'Chinese': 'zh',
  'Arabic': 'ar', 'Portuguese': 'pt', 'Russian': 'ru',
  'Japanese': 'ja', 'Korean': 'ko', 'Italian': 'it',
  'Dutch': 'nl', 'Turkish': 'tr', 'Polish': 'pl',
  'Punjabi': 'pa', 'Bengali': 'bn', 'Urdu': 'ur',
};

// ─── MyMemory Free Fallback ───────────────────────────────────────────────────
async function translateWithMyMemory(text, sourceLang, targetLang) {
  const srcCode = LANG_CODE_MAP[sourceLang] || 'en';
  const tgtCode = LANG_CODE_MAP[targetLang] || 'hi';
  const langPair = `${srcCode}|${tgtCode}`;

  const sentences = text.match(/[^.!?\n]{1,490}[.!?\n]?/g) || [text];
  const translated = [];

  for (const sentence of sentences) {
    if (!sentence.trim()) { translated.push(sentence); continue; }
    const encoded = encodeURIComponent(sentence.trim());
    const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=${langPair}`;

    const result = await new Promise((resolve) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.responseData?.translatedText || sentence);
          } catch { resolve(sentence); }
        });
      }).on('error', () => resolve(sentence));
    });
    translated.push(result);
  }
  return translated.join(' ');
}

// ─── Gemini Translate Function ────────────────────────────────────────────────
async function translateWithGemini(text, sourceLang, targetLang) {
  const langInstruction = (sourceLang === 'auto' || sourceLang === 'Auto Detect')
    ? 'Detect the source language automatically.'
    : `The source language is ${sourceLang}.`;

  const prompt = `You are a professional translator. ${langInstruction}
Translate the following text into ${targetLang}.
Return ONLY the translated text — no explanations, no notes, no quotes, no markdown.

Text to translate:
${text}`;

  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

// ─── Smart Translate: Gemini → MyMemory fallback ─────────────────────────────
async function smartTranslate(text, sourceLang, targetLang) {
  // 1️⃣ Try Gemini first (primary)
  try {
    const translated = await translateWithGemini(text, sourceLang, targetLang);
    return { text: translated, engine: 'Gemini 1.5 Flash ✨' };
  } catch (err) {
    console.warn(`⚠️  Gemini failed: ${err.message} — switching to MyMemory fallback...`);
  }

  // 2️⃣ Fallback: MyMemory (free, no key)
  try {
    const translated = await translateWithMyMemory(text, sourceLang, targetLang);
    return { text: translated, engine: 'MyMemory (Free Fallback)' };
  } catch (err) {
    throw new Error('All translation engines failed. Please try again.');
  }
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'Gemini 1.5 Flash',
    gemini: !!process.env.GEMINI_API_KEY,
  });
});

// ─── Text Translation ─────────────────────────────────────────────────────────
app.post('/api/translate', async (req, res) => {
  const { text, targetLang, sourceLang = 'auto' } = req.body;
  if (!text || !targetLang) {
    return res.status(400).json({ error: 'text and targetLang are required' });
  }
  try {
    const result = await smartTranslate(text, sourceLang, targetLang);
    res.json({ translatedText: result.text, model: result.engine });
  } catch (err) {
    console.error('Translation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Document Translation ─────────────────────────────────────────────────────
app.post('/api/translate/document', upload.single('document'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No document uploaded' });
  }

  const { targetLang = 'Hindi', sourceLang = 'auto' } = req.body;
  const filePath = req.file.path;
  const originalName = req.file.originalname;
  const ext = path.extname(originalName).toLowerCase();
  let extractedText = '';

  try {
    // ── Extract text ───────────────────────────────────────────────────────
    if (ext === '.txt') {
      extractedText = fs.readFileSync(filePath, 'utf8');

    } else if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;

    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      extractedText = result.value;

    } else if (ext === '.doc') {
      return res.status(400).json({ error: '.doc format not supported. Please save as .docx.' });

    } else {
      extractedText = fs.readFileSync(filePath, 'utf8');
    }

    extractedText = extractedText.replace(/\x00/g, '').trim();

    if (!extractedText) {
      return res.status(400).json({ error: 'No text found in file. It may be a scanned image-based PDF.' });
    }

    console.log(`📄 Extracted ${extractedText.length} chars from "${originalName}"`);

    // ── Split into chunks (Gemini handles larger context, so 4000 chars) ──
    const CHUNK_SIZE = 4000;
    const chunks = [];
    for (let i = 0; i < extractedText.length; i += CHUNK_SIZE) {
      chunks.push(extractedText.slice(i, i + CHUNK_SIZE));
    }

    console.log(`🔄 Translating ${chunks.length} chunk(s) to ${targetLang} using Gemini...`);

    // Translate chunks sequentially
    const translatedChunks = [];
    let usedEngine = 'Gemini 1.5 Flash ✨';
    for (let i = 0; i < chunks.length; i++) {
      console.log(`   Chunk ${i + 1}/${chunks.length}...`);
      const result = await smartTranslate(chunks[i], sourceLang, targetLang);
      translatedChunks.push(result.text);
      usedEngine = result.engine;
    }

    const translatedText = translatedChunks.join('\n\n');

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    console.log(`✅ Translation complete! Engine: ${usedEngine}`);

    res.json({
      translatedText,
      originalFileName: originalName,
      charCount: extractedText.length,
      model: usedEngine,
    });

  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error('❌ Document translation error:', err.message);
    res.status(500).json({ error: err.message || 'Document translation failed' });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ LingvaHub Backend → http://localhost:${PORT}`);
  console.log(`   🤖 Primary Engine : Gemini 1.5 Flash`);
  console.log(`   🔑 Gemini Key     : ${process.env.GEMINI_API_KEY ? '✓ Set' : '✗ Missing!'}`);
  console.log(`   🔄 Fallback       : MyMemory API (free)\n`);
});

app.get("/", (req, res) => {
  res.send("LingvaHub Backend Running 🚀");
});
