import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft, Mic, Volume2, Copy, ChevronDown, ArrowRight } from 'lucide-react';
import { translateText } from '../services/translationService';
import { speakText, listenText } from '../services/speechService';
import DocumentTranslator from './DocumentTranslator';
import './TranslatorCard.css';

const SUPPORTED_LANGUAGES = [
  { code: 'auto', name: 'Detect Language' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'hi', name: 'Hindi' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
];

const TranslatorCard = () => {
  const [activeTab, setActiveTab] = useState('text'); // text, document
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  // Auto translate on pause, but also allow button click
  useEffect(() => {
    if (activeTab !== 'text') return;
    const delayDebounceFn = setTimeout(() => {
      if (sourceText.trim()) {
        handleTranslate();
      } else {
        setTargetText('');
      }
    }, 800);
    return () => clearTimeout(delayDebounceFn);
  }, [sourceText, sourceLang, targetLang, activeTab]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    try {
      const result = await translateText(sourceText, sourceLang, targetLang);
      setTargetText(result);
    } catch (error) {
      console.error(error);
      setTargetText("Error during translation.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwap = () => {
    if (sourceLang !== 'auto') {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
      if (activeTab === 'text') {
        setSourceText(targetText);
        setTargetText(sourceText);
      }
    }
  };

  const handleListen = async () => {
    try {
      const text = await listenText(sourceLang === 'auto' ? 'en' : sourceLang);
      if (text) setSourceText(prev => prev ? `${prev} ${text}` : text);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = (text) => text && navigator.clipboard.writeText(text);
  const handleSpeak = (text, lang) => text && speakText(text, lang === 'auto' ? 'en' : lang);

  // Document tab is handled by the dedicated DocumentTranslator component

  return (
    <div className="translator-wrapper">
      <div className="translator-card">
        {/* Header Tabs (Advanced feature) */}
        <div className="tc-header">
          <div className="tc-tabs">
            <div 
              className={`tc-tab ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => setActiveTab('text')}
            >
              Text Translation
            </div>
            <div 
              className={`tc-tab ${activeTab === 'document' ? 'active' : ''}`}
              onClick={() => setActiveTab('document')}
            >
              Document
            </div>
          </div>
        </div>

        {activeTab === 'text' ? (
          <div className="tc-body">
            {/* Source Pane */}
            <div className="tc-pane">
              <div className="tc-lang-select">
                <select value={sourceLang} onChange={e => setSourceLang(e.target.value)}>
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={`src-${l.code}`} value={l.code}>{l.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} color="var(--text-tertiary)" />
              </div>
              <textarea
                className="tc-textarea"
                placeholder="Type or paste your text here..."
                value={sourceText}
                onChange={e => setSourceText(e.target.value)}
                maxLength={5000}
              />
              <div className="tc-footer">
                <span className="tc-char-count">{sourceText.length} / 5000</span>
                <div className="tc-actions">
                  <button className="btn-icon" onClick={handleListen}><Mic size={20} /></button>
                  <button className="btn-icon" onClick={() => handleSpeak(sourceText, sourceLang)}><Volume2 size={20} /></button>
                </div>
              </div>
            </div>

            {/* Middle Swap Button */}
            <button className="tc-swap-btn" onClick={handleSwap}>
              <ArrowRightLeft size={18} />
            </button>

            {/* Target Pane */}
            <div className="tc-pane">
              <div className="tc-lang-select">
                <select value={targetLang} onChange={e => setTargetLang(e.target.value)}>
                  {SUPPORTED_LANGUAGES.filter(l => l.code !== 'auto').map(l => (
                    <option key={`tgt-${l.code}`} value={l.code}>{l.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} color="var(--text-tertiary)" />
              </div>
              <textarea
                className="tc-textarea"
                placeholder="Translation will appear here..."
                value={isTranslating ? 'Translating...' : targetText}
                readOnly
              />
              <div className="tc-footer" style={{ justifyContent: 'flex-end' }}>
                <div className="tc-actions">
                  <button className="btn-icon" onClick={() => handleSpeak(targetText, targetLang)}><Volume2 size={20} /></button>
                  <button className="btn-icon" onClick={() => handleCopy(targetText)}><Copy size={20} /></button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: 'var(--spacing-4) 0' }}>
            <DocumentTranslator />
          </div>
        )}

        {/* Floating Action Button */}
        {activeTab === 'text' && (
          <button className="tc-main-action" onClick={handleTranslate}>
            Translate <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TranslatorCard;
