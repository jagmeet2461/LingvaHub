import React, { useState } from 'react';
import { Send, Languages, User } from 'lucide-react';
import { translateText } from '../services/translationService';

export default function ChatTranslator() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Type a message here to instantly translate it.", sender: "bot", lang: "en" }
  ]);
  const [inputText, setInputText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newUserMsg = { id: Date.now(), text: inputText, sender: "user", lang: sourceLang };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText("");
    setIsTranslating(true);

    try {
      const translated = await translateText(inputText, sourceLang, targetLang);
      const newBotMsg = { id: Date.now() + 1, text: translated, sender: "bot", lang: targetLang };
      setMessages(prev => [...prev, newBotMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "Failed to translate.", sender: "bot", lang: targetLang, error: true }]);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'var(--spacing-8) auto', display: 'flex', flexDirection: 'column', height: '75vh', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-light)' }}>
      
      {/* Header */}
      <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Languages size={20} /> Real-time Chat Translation</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select value={sourceLang} onChange={e => setSourceLang(e.target.value)} style={{ padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
          </select>
          <span style={{ color: 'var(--text-secondary)' }}>to</span>
          <select value={targetLang} onChange={e => setTargetLang(e.target.value)} style={{ padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
            <option value="es">Spanish</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: 'var(--spacing-6)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: '0.5rem', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
            {msg.sender === 'bot' && <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}><Languages size={16} /></div>}
            <div style={{ backgroundColor: msg.sender === 'user' ? 'var(--brand-primary)' : 'var(--bg-secondary)', color: msg.sender === 'user' ? 'white' : (msg.error ? 'var(--error)' : 'var(--text-primary)'), padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-lg)', borderTopRightRadius: msg.sender === 'user' ? 0 : 'var(--radius-lg)', borderTopLeftRadius: msg.sender === 'bot' ? 0 : 'var(--radius-lg)' }}>
              {msg.text}
            </div>
            {msg.sender === 'user' && <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', flexShrink: 0 }}><User size={16} /></div>}
          </div>
        ))}
        {isTranslating && <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Translating...</div>}
      </div>

      {/* Input */}
      <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--border-light)', display: 'flex', gap: 'var(--spacing-2)' }}>
        <input 
          type="text" 
          value={inputText} 
          onChange={e => setInputText(e.target.value)} 
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message to translate..." 
          style={{ flex: 1, padding: 'var(--spacing-3) var(--spacing-4)', borderRadius: 'var(--radius-3xl)', border: '1px solid var(--border-light)', backgroundColor: 'transparent', color: 'var(--text-primary)' }} 
        />
        <button className="btn btn-primary" onClick={handleSend} disabled={isTranslating} style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, flexShrink: 0 }}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
