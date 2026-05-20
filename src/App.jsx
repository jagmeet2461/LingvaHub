import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingHero from './components/LandingHero';
import TranslatorCard from './components/TranslatorCard';
import ChatTranslator from './components/ChatTranslator';
import Footer from './components/Footer';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/Dashboard';
import Pricing from './pages/Pricing';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Main */}
              <Route path="/" element={<LandingHero />} />
              <Route path="/translator" element={
                <div style={{ paddingTop: 'var(--spacing-8)' }}>
                  <TranslatorCard />
                </div>
              } />
              <Route path="/chat" element={<ChatTranslator />} />

              {/* Auth */}
              <Route path="/login"     element={<Login />} />
              <Route path="/signup"    element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Info Pages */}
              <Route path="/pricing"  element={<Pricing />} />
              <Route path="/features" element={<Features />} />
              <Route path="/about"    element={<About />} />
              <Route path="/contact"  element={<Contact />} />

              {/* Footer legal pages — simple placeholders */}
              <Route path="/privacy"  element={<SimplePage title="Privacy Policy"  content="Your data is private and never sold. Translations are processed securely and not stored without your consent." />} />
              <Route path="/terms"    element={<SimplePage title="Terms of Service" content="By using LingvaHub, you agree to our terms. The service is provided as-is for personal and commercial use." />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

// ── Simple Placeholder Page ───────────────────────────────────────────────────
function SimplePage({ title, content }) {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>{title}</h1>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>{content}</p>
    </div>
  );
}

// ── 404 Page ──────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 900, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white', padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 700, textDecoration: 'none' }}>Go Home</a>
    </div>
  );
}

export default App;
