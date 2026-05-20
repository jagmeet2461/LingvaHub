// ─── Translation History (localStorage) ────────────────────────────────────
export function saveToHistory({ sourceText, translatedText, sourceLang, targetLang, type = 'text' }) {
  try {
    const history = getHistory();
    const entry = {
      id: Date.now(),
      sourceText: sourceText?.slice(0, 200),
      translatedText: translatedText?.slice(0, 200),
      sourceLang,
      targetLang,
      type, // 'text' | 'document'
      timestamp: new Date().toISOString(),
    };
    history.unshift(entry);
    // Keep last 50 entries
    localStorage.setItem('lingvahub_history', JSON.stringify(history.slice(0, 50)));
  } catch (e) { /* ignore */ }
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('lingvahub_history') || '[]');
  } catch { return []; }
}

export function clearHistory() {
  localStorage.removeItem('lingvahub_history');
}

// ─── Main Translation Function ───────────────────────────────────────────────
export const translateText = async (text, sourceLang, targetLang) => {
  if (!text || text.trim() === '') return '';

  const sl = sourceLang === 'auto' ? 'auto' : sourceLang;
  const tl = targetLang;

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`
    );

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    if (data && data[0]) {
      const translatedText = data[0].map(segment => segment[0]).join('');
      // Save to history
      saveToHistory({ sourceText: text, translatedText, sourceLang, targetLang, type: 'text' });
      return translatedText;
    }

    return 'Error: Could not parse translation';
  } catch (error) {
    console.error('Translation API error:', error);
    return 'Translation failed. Please try again later.';
  }
};
