import React from 'react';
import { Link } from 'react-router-dom';
import { Languages, Target, Heart, Globe } from 'lucide-react';
import './Pages.css';

const team = [
  { name: 'LingvaHub Lead Team',  role: 'Product Strategy & Vision',  initial: 'L', color: '#6366f1' },
  { name: 'AI Engineering Team',  role: 'Gemini AI Integration',       initial: 'A', color: '#8b5cf6' },
  { name: 'Design & UX Team',     role: 'UI/UX Design & Experience',  initial: 'D', color: '#10b981' },
];

const values = [
  { icon: Globe,    title: 'Global Access',  desc: 'We believe language should never be a barrier. Our goal is to make communication free for everyone, everywhere.' },
  { icon: Target,   title: 'Accuracy First', desc: 'Powered by Gemini 1.5 Flash, we deliver context-aware, nuanced translations that feel natural and professional.' },
  { icon: Heart,    title: 'User-First',     desc: 'Every design decision is made with the user in mind. Simple, fast, and beautiful — no unnecessary complexity.' },
];

export default function About() {
  return (
    <div className="page-container">
      {/* Hero */}
      <div className="page-hero">
        <p className="page-tag">Our Story</p>
        <h1 className="page-hero-title">Breaking Language Barriers <span>With AI</span></h1>
        <p className="page-hero-sub">LingvaHub was built to make AI-powered translation accessible to every person on Earth — free, fast, and accurate.</p>
      </div>

      {/* Mission */}
      <div className="page-section about-mission">
        <div className="about-mission-grid">
          <div>
            <h2 className="about-section-h2">Our Mission</h2>
            <p className="about-p">LingvaHub was founded with a simple belief: <strong>language should unite, not divide</strong>. We've built a platform powered by Google's Gemini AI that delivers professional-grade translations instantly, for free.</p>
            <p className="about-p">From a single student's resume being translated to a business negotiating across continents — LingvaHub is there for every moment that matters.</p>
          </div>
          <div className="about-stats-col">
            <div className="about-stat"><span className="about-stat-num">100+</span><span className="about-stat-label">Languages Supported</span></div>
            <div className="about-stat"><span className="about-stat-num">∞</span><span className="about-stat-label">Free Translations</span></div>
            <div className="about-stat"><span className="about-stat-num">3</span><span className="about-stat-label">File Formats Supported</span></div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="page-section">
        <h2 className="page-section-title">Our Values</h2>
        <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feature-card">
              <div className="feature-icon" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                <Icon size={24} />
              </div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="page-section">
        <h2 className="page-section-title">Meet the Team</h2>
        <div className="team-grid">
          {team.map(({ name, role, initial, color }) => (
            <div key={name} className="team-card">
              <div className="team-avatar" style={{ background: `${color}20`, color }}>{initial}</div>
              <h3 className="team-name">{name}</h3>
              <p className="team-role">{role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="page-cta-banner">
        <h2>Join us in breaking language barriers</h2>
        <p>Create your free account and start translating in seconds.</p>
        <div className="page-cta-btns">
          <Link to="/signup" className="btn-hero-primary">Get Started Free →</Link>
          <Link to="/contact" className="btn-hero-secondary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
