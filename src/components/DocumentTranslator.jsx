import React, { useState, useRef } from 'react';
import {
  Upload, FileText, FileType, File, Download, Loader2,
  CheckCircle2, AlertCircle, X, Languages, ChevronDown
} from 'lucide-react';
import './DocumentTranslator.css';

const SUPPORTED_LANGUAGES = [
  { code: 'auto', name: 'Auto Detect' },
  { code: 'English', name: 'English' },
  { code: 'Hindi', name: 'Hindi (हिन्दी)' },
  { code: 'Spanish', name: 'Spanish' },
  { code: 'French', name: 'French' },
  { code: 'German', name: 'German' },
  { code: 'Chinese', name: 'Chinese (中文)' },
  { code: 'Arabic', name: 'Arabic (العربية)' },
  { code: 'Portuguese', name: 'Portuguese' },
  { code: 'Russian', name: 'Russian' },
  { code: 'Japanese', name: 'Japanese (日本語)' },
  { code: 'Korean', name: 'Korean (한국어)' },
  { code: 'Italian', name: 'Italian' },
  { code: 'Dutch', name: 'Dutch' },
  { code: 'Turkish', name: 'Turkish' },
  { code: 'Polish', name: 'Polish' },
  { code: 'Punjabi', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'Bengali', name: 'Bengali (বাংলা)' },
  { code: 'Urdu', name: 'Urdu (اردو)' },
];

const FILE_TYPES = {
  '.txt':  { label: 'TXT',  icon: FileText, color: '#6366f1' },
  '.pdf':  { label: 'PDF',  icon: FileType, color: '#ef4444' },
  '.docx': { label: 'DOCX', icon: File,     color: '#3b82f6' },
  '.doc':  { label: 'DOC',  icon: File,     color: '#3b82f6' },
};

function getFileExt(filename) {
  return filename.slice(filename.lastIndexOf('.')).toLowerCase();
}

function getFileInfo(filename) {
  const ext = getFileExt(filename);
  return FILE_TYPES[ext] || { label: 'FILE', icon: File, color: '#9ca3af' };
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

export default function DocumentTranslator() {
  const [file, setFile]               = useState(null);
  const [sourceLang, setSourceLang]   = useState('auto');
  const [targetLang, setTargetLang]   = useState('Hindi');
  const [status, setStatus]           = useState('idle'); // idle | uploading | translating | done | error
  const [result, setResult]           = useState('');
  const [errorMsg, setErrorMsg]       = useState('');
  const [isDragging, setIsDragging]   = useState(false);
  const inputRef = useRef(null);

  const BACKEND = 'http://localhost:5000';

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (f) selectFile(f);
  }

  function selectFile(f) {
    const ext = getFileExt(f.name);
    if (!['.txt', '.pdf', '.docx'].includes(ext)) {
      setErrorMsg(`Unsupported file type "${ext}". Please upload a .txt, .pdf, or .docx file.`);
      setStatus('error');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg('File is too large. Maximum size is 10 MB.');
      setStatus('error');
      return;
    }
    setFile(f);
    setStatus('idle');
    setResult('');
    setErrorMsg('');
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) selectFile(f);
  }

  function clearFile() {
    setFile(null);
    setStatus('idle');
    setResult('');
    setErrorMsg('');
    if (inputRef.current) inputRef.current.value = '';
  }

  async function handleTranslate() {
    if (!file) return;
    setStatus('uploading');
    setResult('');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('sourceLang', sourceLang);
      formData.append('targetLang', targetLang);

      setStatus('translating');

      const res = await fetch(`${BACKEND}/api/translate/document`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Translation failed');

      setResult(data.translatedText);
      setStatus('done');
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Make sure the backend server is running.');
      setStatus('error');
    }
  }

  function handleDownload() {
    if (!result) return;
    const baseName = file ? file.name.replace(/\.[^.]+$/, '') : 'document';
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${baseName}_translated_${targetLang}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const isTranslating = status === 'uploading' || status === 'translating';
  const fileInfo = file ? getFileInfo(file.name) : null;
  const FileIcon = fileInfo?.icon || File;

  return (
    <div className="doc-translator">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="doc-header">
        <div className="doc-header-icon"><Languages size={22} /></div>
        <div>
          <h2 className="doc-header-title">Document Translation</h2>
          <p className="doc-header-sub">Translate TXT, PDF and DOCX files using AI</p>
        </div>
      </div>

      {/* ── Language Selectors ──────────────────────────────────────── */}
      <div className="doc-lang-row">
        <div className="doc-lang-select-wrap">
          <label className="doc-lang-label">From</label>
          <div className="doc-select-box">
            <select
              value={sourceLang}
              onChange={e => setSourceLang(e.target.value)}
              className="doc-select"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="doc-select-arrow" />
          </div>
        </div>

        <div className="doc-lang-arrow">→</div>

        <div className="doc-lang-select-wrap">
          <label className="doc-lang-label">To</label>
          <div className="doc-select-box">
            <select
              value={targetLang}
              onChange={e => setTargetLang(e.target.value)}
              className="doc-select"
            >
              {SUPPORTED_LANGUAGES.filter(l => l.code !== 'auto').map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="doc-select-arrow" />
          </div>
        </div>
      </div>

      {/* ── Drop Zone ──────────────────────────────────────────────── */}
      {!file ? (
        <div
          className={`doc-dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".txt,.pdf,.docx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div className="doc-dropzone-icon">
            <Upload size={36} />
          </div>
          <p className="doc-dropzone-title">Drop your file here, or <span className="doc-dropzone-link">browse</span></p>
          <p className="doc-dropzone-sub">Supports TXT, PDF, DOCX — max 10 MB</p>

          <div className="doc-format-badges">
            {Object.entries(FILE_TYPES).filter(([k]) => k !== '.doc').map(([ext, info]) => (
              <span key={ext} className="doc-format-badge" style={{ borderColor: info.color, color: info.color }}>
                {info.label}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* ── File Preview ────────────────────────────────────────── */
        <div className="doc-file-preview">
          <div className="doc-file-icon-wrap" style={{ background: `${fileInfo.color}18`, color: fileInfo.color }}>
            <FileIcon size={28} />
          </div>
          <div className="doc-file-info">
            <p className="doc-file-name">{file.name}</p>
            <p className="doc-file-meta">{fileInfo.label} · {formatSize(file.size)}</p>
          </div>
          <button className="doc-file-remove" onClick={clearFile} title="Remove file">
            <X size={18} />
          </button>
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────────── */}
      {status === 'error' && (
        <div className="doc-error-box">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── Translate Button ────────────────────────────────────────── */}
      <button
        className="doc-translate-btn"
        onClick={handleTranslate}
        disabled={!file || isTranslating}
      >
        {isTranslating ? (
          <>
            <Loader2 size={18} className="doc-spinner" />
            {status === 'uploading' ? 'Uploading…' : 'Translating with AI…'}
          </>
        ) : (
          <>
            <Languages size={18} />
            Translate Document
          </>
        )}
      </button>

      {/* ── Result ─────────────────────────────────────────────────── */}
      {status === 'done' && result && (
        <div className="doc-result">
          <div className="doc-result-header">
            <div className="doc-result-title-row">
              <CheckCircle2 size={18} className="doc-result-check" />
              <span className="doc-result-title">Translation Complete</span>
            </div>
            <button className="doc-download-btn" onClick={handleDownload}>
              <Download size={16} />
              Download .txt
            </button>
          </div>
          <div className="doc-result-body">
            <pre className="doc-result-text">{result}</pre>
          </div>
        </div>
      )}

      {/* ── Tips ───────────────────────────────────────────────────── */}
      {status === 'idle' && !file && (
        <div className="doc-tips">
          <p className="doc-tips-title">💡 Tips</p>
          <ul className="doc-tips-list">
            <li>PDF files must contain selectable text (not scanned images)</li>
            <li>DOCX files preserve paragraph structure</li>
            <li>Large files are split into chunks for accurate translation</li>
            <li>Make sure the backend server is running on port 5000</li>
          </ul>
        </div>
      )}
    </div>
  );
}
