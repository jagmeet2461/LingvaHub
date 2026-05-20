import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Zap, FileText, Mic, MessageSquare, Shield, Moon, Clock, Languages } from 'lucide-react';
import './Pages.css';

const features = [
  { icon: Globe,        title: '100+ Languages',          desc: 'Translate between over 100 languages instantly with high accuracy powered by Gemini AI.',      color: '#6366f1' },
  { icon: Zap,          title: 'Real-Time Translation',    desc: 'Text is translated as you type — zero delay. Perfect for fast-paced work and learning.',         color: '#8b5cf6' },
  { icon: FileText,     title: 'Document Translation',     desc: 'Upload PDF, DOCX or TXT files. Our AI extracts and translates the full content in seconds.',      color: '#10b981' },
  { icon: Mic,          title: 'Voice Translation',        desc: 'Speak into your microphone and translate audio in real-time. Great for conversations.',           color: '#f59e0b' },
  { icon: MessageSquare,title: 'Chat Translator',          desc: 'A WhatsApp-style chat interface for back-and-forth conversational translation.',                  color: '#3b82f6' },
  { icon: Shield,       title: 'Privacy First',            desc: 'Your text is never stored on our servers without consent. Complete data privacy guaranteed.',     color: '#ef4444' },
  { icon: Moon,         title: 'Dark Mode',                desc: 'Switch between a crisp light and a stunning dark theme with one click from the navbar.',          color: '#6366f1' },
  { icon: Clock,        title: 'Translation History',      desc: 'Your recent translations are saved locally. Copy or replay any previous translation instantly.',  color: '#8b5cf6' },
];

const steps = [
  { step: '01', title: 'Type or Upload', desc: 'Enter text or upload a PDF, DOCX, or TXT document.' },
  { step: '02', title: 'Select Languages', desc: 'Choose source and target languages — or use Auto Detect.' },
  { step: '03', title: 'Translate Instantly', desc: 'Gemini AI delivers an accurate translation in seconds.' },
];

export default function Features() {
  return (
    <div className="page-container">
      {/* Hero */}
      <div className="page-hero">
        <p className="page-tag">Everything You Need</p>
        <h1 className="page-hero-title">Powerful Features for <span>Every Use Case</span></h1>
        <p className="page-hero-sub">From quick text lookups to full document translation — LingvaHub has it all.</p>
        <div className="page-hero-btns">
          <Link to="/translator" className="btn-hero-primary">Try Free Now →</Link>
          <Link to="/pricing" className="btn-hero-secondary">See Pricing</Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="page-section">
        <div className="features-grid">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon" style={{ background: `${color}15`, color }}>
                <Icon size={24} />
              </div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="page-section how-it-works-section">
        <h2 className="page-section-title">How It Works</h2>
        <div className="steps-row">
          {steps.map(({ step, title, desc }, i) => (
            <React.Fragment key={step}>
              <div className="step-card">
                <div className="step-num">{step}</div>
                <h3 className="step-title">{title}</h3>
                <p className="step-desc">{desc}</p>
              </div>
              {i < steps.length - 1 && <div className="step-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="page-cta-banner">
        <h2>Start translating for free today</h2>
        <p>No credit card needed. Upgrade anytime.</p>
        <div className="page-cta-btns">
          <Link to="/signup" className="btn-hero-primary">Create Free Account →</Link>
        </div>
      </div>
    </div>
  );
}
