import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut, Languages, FileText, MessageSquare, Zap,
  Clock, Trash2, Copy, Volume2, Star, Crown,
  BarChart2, Globe, TrendingUp, User, ChevronRight,
  Download, CheckCircle, Shield, Sparkles, ArrowRight
} from 'lucide-react';
import { getHistory, clearHistory } from '../services/translationService';
import { speakText } from '../services/speechService';
import './Dashboard.css';

// ─── Helper ───────────────────────────────────────────────────────────────────
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs  < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

function getLangName(code) {
  const map = { auto:'Auto', en:'English', es:'Spanish', fr:'French', de:'German',
    hi:'Hindi', zh:'Chinese', ja:'Japanese', ko:'Korean', ar:'Arabic',
    pt:'Portuguese', ru:'Russian', it:'Italian', nl:'Dutch', tr:'Turkish',
    pl:'Polish', pa:'Punjabi', bn:'Bengali', ur:'Urdu' };
  return map[code] || code;
}

const PLAN_FEATURES = [
  { icon: Zap,      text: 'Gemini 1.5 Flash AI Engine' },
  { icon: FileText, text: 'Unlimited PDF & DOCX translation' },
  { icon: Globe,    text: '100+ languages supported' },
  { icon: Shield,   text: 'Privacy-first, secure translations' },
];

const PRO_FEATURES = [
  'GPT-4 Turbo Integration',
  'Voice-to-Voice Translation',
  'PDF layout preservation',
  'Priority support & API access',
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="db-stat-card" style={{ '--accent': color, '--accent-bg': bg }}>
      <div className="db-stat-icon"><Icon size={22} /></div>
      <div className="db-stat-info">
        <p className="db-stat-value">{value}</p>
        <p className="db-stat-label">{label}</p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory]   = useState([]);
  const [copied, setCopied]     = useState(null);
  const [activeTab, setActiveTab] = useState('history'); // history | stats

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  function handleCopy(text, id) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
  }

  // ── Compute Stats ─────────────────────────────────────────────────────────
  const totalTranslations = history.length;
  const totalChars = history.reduce((s, h) => s + (h.sourceText?.length || 0), 0);
  const docCount   = history.filter(h => h.type === 'document').length;
  const langSet    = new Set(history.map(h => h.targetLang));
  const uniqueLangs = langSet.size;

  // Language frequency
  const langFreq = {};
  history.forEach(h => {
    const l = getLangName(h.targetLang);
    langFreq[l] = (langFreq[l] || 0) + 1;
  });
  const topLangs = Object.entries(langFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const username = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const memberSince = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : 'Today';

  if (!currentUser) {
    return (
      <div className="db-gate">
        <Languages size={40} />
        <h2>Please log in to view your dashboard</h2>
        <Link to="/login" className="db-gate-btn">Log In</Link>
      </div>
    );
  }

  return (
    <div className="db-page">

      {/* ── Top Hero Banner ────────────────────────────────────────────── */}
      <div className="db-hero">
        <div className="db-hero-inner">
          <div className="db-hero-left">
            <div className="db-avatar">
              {username[0]?.toUpperCase()}
            </div>
            <div>
              <p className="db-greeting">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'} 👋</p>
              <h1 className="db-username">{username}</h1>
              <p className="db-email">{currentUser.email} · Member since {memberSince}</p>
            </div>
          </div>
          <button className="db-logout-btn" onClick={handleLogout}>
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      <div className="db-content">

        {/* ── Stats Row ──────────────────────────────────────────────────── */}
        <div className="db-stats-row">
          <StatCard icon={Languages}   label="Total Translations" value={totalTranslations} color="#6366f1" bg="rgba(99,102,241,0.1)" />
          <StatCard icon={Globe}       label="Languages Used"     value={uniqueLangs}        color="#8b5cf6" bg="rgba(139,92,246,0.1)" />
          <StatCard icon={FileText}    label="Documents"          value={docCount}           color="#10b981" bg="rgba(16,185,129,0.1)" />
          <StatCard icon={TrendingUp}  label="Characters"         value={totalChars > 999 ? `${(totalChars/1000).toFixed(1)}K` : totalChars} color="#f59e0b" bg="rgba(245,158,11,0.1)" />
        </div>

        {/* ── Quick Actions ──────────────────────────────────────────────── */}
        <div className="db-section">
          <h2 className="db-section-title">Quick Actions</h2>
          <div className="db-quick-actions">
            <Link to="/translator" className="db-quick-card db-quick-translate">
              <div className="db-quick-icon"><Languages size={24} /></div>
              <div><p className="db-quick-label">Translate Text</p><p className="db-quick-sub">100+ languages</p></div>
              <ChevronRight size={18} className="db-quick-arrow" />
            </Link>
            <Link to="/" className="db-quick-card db-quick-doc">
              <div className="db-quick-icon"><FileText size={24} /></div>
              <div><p className="db-quick-label">Translate Document</p><p className="db-quick-sub">PDF, DOCX, TXT</p></div>
              <ChevronRight size={18} className="db-quick-arrow" />
            </Link>
            <Link to="/chat" className="db-quick-card db-quick-chat">
              <div className="db-quick-icon"><MessageSquare size={24} /></div>
              <div><p className="db-quick-label">Chat Translator</p><p className="db-quick-sub">Real-time chat</p></div>
              <ChevronRight size={18} className="db-quick-arrow" />
            </Link>
          </div>
        </div>

        {/* ── Main Content Grid ──────────────────────────────────────────── */}
        <div className="db-main-grid">

          {/* Left: History / Stats Tabs */}
          <div className="db-left-col">
            <div className="db-card">
              <div className="db-card-header">
                <div className="db-tab-row">
                  <button className={`db-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                    <Clock size={15} /> History
                  </button>
                  <button className={`db-tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
                    <BarChart2 size={15} /> Language Stats
                  </button>
                </div>
                {activeTab === 'history' && history.length > 0 && (
                  <button className="db-clear-btn" onClick={handleClearHistory}>
                    <Trash2 size={14} /> Clear
                  </button>
                )}
              </div>

              {/* History Tab */}
              {activeTab === 'history' && (
                <div className="db-history-list">
                  {history.length === 0 ? (
                    <div className="db-empty">
                      <Clock size={36} />
                      <p>No translations yet</p>
                      <Link to="/translator" className="db-empty-btn">Start Translating →</Link>
                    </div>
                  ) : (
                    history.slice(0, 10).map(item => (
                      <div key={item.id} className="db-history-item">
                        <div className="db-history-meta">
                          <span className={`db-history-type ${item.type}`}>
                            {item.type === 'document' ? <FileText size={11} /> : <Languages size={11} />}
                            {item.type}
                          </span>
                          <span className="db-history-langs">
                            {getLangName(item.sourceLang)} → {getLangName(item.targetLang)}
                          </span>
                          <span className="db-history-time">{timeAgo(item.timestamp)}</span>
                        </div>
                        <p className="db-history-source">"{item.sourceText}"</p>
                        <p className="db-history-translated">{item.translatedText}</p>
                        <div className="db-history-actions">
                          <button onClick={() => handleCopy(item.translatedText, item.id)} className="db-icon-btn">
                            {copied === item.id ? <CheckCircle size={14} color="var(--success)" /> : <Copy size={14} />}
                          </button>
                          <button onClick={() => speakText(item.translatedText, item.targetLang)} className="db-icon-btn">
                            <Volume2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div className="db-stats-list">
                  {topLangs.length === 0 ? (
                    <div className="db-empty">
                      <BarChart2 size={36} />
                      <p>Translate something to see stats</p>
                    </div>
                  ) : (
                    <>
                      <p className="db-stats-subtitle">Your most translated languages</p>
                      {topLangs.map(([lang, count], i) => {
                        const pct = Math.round((count / totalTranslations) * 100);
                        const colors = ['#6366f1','#8b5cf6','#10b981','#f59e0b','#3b82f6'];
                        return (
                          <div key={lang} className="db-lang-bar-row">
                            <div className="db-lang-bar-label">
                              <span className="db-lang-rank" style={{ background: colors[i] }}>{i+1}</span>
                              <span>{lang}</span>
                            </div>
                            <div className="db-lang-bar-track">
                              <div className="db-lang-bar-fill" style={{ width: `${pct}%`, background: colors[i] }} />
                            </div>
                            <span className="db-lang-count">{count}x</span>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Plan + Pro Upgrade */}
          <div className="db-right-col">

            {/* Current Plan */}
            <div className="db-card db-plan-card">
              <div className="db-plan-header">
                <div className="db-plan-badge">
                  <Sparkles size={14} /> Free Plan
                </div>
              </div>
              <h3 className="db-plan-title">Your Current Features</h3>
              <ul className="db-plan-features">
                {PLAN_FEATURES.map(({ icon: Icon, text }) => (
                  <li key={text} className="db-plan-feature">
                    <Icon size={16} className="db-feature-icon" /> {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Upgrade */}
            <div className="db-card db-pro-card">
              <div className="db-pro-glow" />
              <div className="db-pro-header">
                <Crown size={20} className="db-crown" />
                <h3 className="db-pro-title">LingvaHub Pro</h3>
              </div>
              <p className="db-pro-desc">Unlock the full power of AI translation</p>
              <ul className="db-pro-features">
                {PRO_FEATURES.map(f => (
                  <li key={f} className="db-pro-feature">
                    <CheckCircle size={14} className="db-pro-check" /> {f}
                  </li>
                ))}
              </ul>
              <div className="db-pro-price">
                <span className="db-pro-amount">₹799</span>
                <span className="db-pro-period">/month</span>
              </div>
              <button className="db-pro-btn" onClick={() => alert('🚀 Pro upgrade coming soon! Thank you for your interest.')}>
                <Star size={16} /> Upgrade to Pro
              </button>
              <p className="db-pro-note">Cancel anytime · 7-day free trial</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
