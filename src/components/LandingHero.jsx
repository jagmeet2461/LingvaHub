import React from 'react';
import { Sparkles, Globe2, Shield, Zap, Check, Edit3, Globe, CheckCircle2 } from 'lucide-react';
import TranslatorCard from './TranslatorCard';
import './LandingHero.css';

const LandingHero = () => {
  return (
    <>
      <div className="hero-section">
        <h1 className="hero-title">
          Translate Text <span>Instantly</span>
        </h1>
        <p className="hero-subtitle">
          Free AI-powered translator supporting 100+ languages.<br/>
          Translate words, phrases, and sentences with accurate meaning.
        </p>
        
        <div className="hero-badges">
          <div className="badge">
            <Check size={16} />
            100+ Languages
          </div>
          <div className="badge">
            <Check size={16} />
            AI-Powered Accuracy
          </div>
        </div>
      </div>
      
      <TranslatorCard />

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper feature-purple">
            <Sparkles size={24} />
          </div>
          <div className="feature-text">
            <h3>AI-Powered</h3>
            <p>Advanced AI ensures precise and natural translations.</p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper feature-green">
            <Globe2 size={24} />
          </div>
          <div className="feature-text">
            <h3>100+ Languages</h3>
            <p>Translate between 100+ languages instantly.</p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper feature-orange">
            <Shield size={24} />
          </div>
          <div className="feature-text">
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and never stored.</p>
          </div>
        </div>
        <div className="feature-card">
          <div className="feature-icon-wrapper feature-blue">
            <Zap size={24} />
          </div>
          <div className="feature-text">
            <h3>Instant Results</h3>
            <p>Get accurate translations in real-time.</p>
          </div>
        </div>
      </div>

      <div className="how-it-works" id="features">
        <h2 className="how-title">How <span>LingvaHub</span> Works</h2>
        <p className="how-subtitle">Translate in just 3 simple steps</p>
        
        <div className="steps-container">
          <div className="step-card">
            <div className="step-header">
              <div className="step-icon-wrapper">
                <Edit3 size={32} />
              </div>
              <div className="step-info">
                <div className="step-number">1</div>
                <div className="step-title">Enter Text</div>
              </div>
            </div>
            <p className="step-desc">Type or paste the text you want to translate.</p>
          </div>
          
          <div className="step-card">
            <div className="step-header">
              <div className="step-icon-wrapper">
                <Globe size={32} />
              </div>
              <div className="step-info">
                <div className="step-number">2</div>
                <div className="step-title">Choose Language</div>
              </div>
            </div>
            <p className="step-desc">Select your desired source and target languages.</p>
          </div>
          
          <div className="step-card">
            <div className="step-header">
              <div className="step-icon-wrapper">
                <CheckCircle2 size={32} />
              </div>
              <div className="step-info">
                <div className="step-number">3</div>
                <div className="step-title">Get Translation</div>
              </div>
            </div>
            <p className="step-desc">Click translate and get accurate results instantly.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingHero;
