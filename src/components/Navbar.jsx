import React, { useState, useEffect } from 'react';
import { Languages, Menu, X, Moon, Sun, User, LayoutDashboard } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/translator',label: 'Translator' },
  { to: '/chat',      label: 'Chat' },
  { to: '/features',  label: 'Features' },
  { to: '/pricing',   label: 'Pricing' },
];

const Navbar = () => {
  const [isOpen, setIsOpen]       = useState(false);
  const [isDark, setIsDark]       = useState(() => localStorage.getItem('lh_theme') === 'dark');
  const [scrolled, setScrolled]   = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

  /* Persist theme */
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('lh_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('lh_theme', 'light');
    }
  }, [isDark]);

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setIsOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="nav-container">

        {/* Brand */}
        <Link to="/" className="nav-brand-container">
          <div className="nav-logo-icon"><Languages size={20} /></div>
          <div className="nav-brand-text">
            <span className="nav-title">LingvaHub</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links desktop-only">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={`nav-link ${isActive(to) ? 'active' : ''}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="nav-actions desktop-only">
          <button
            className="nav-theme-btn"
            onClick={() => setIsDark(!isDark)}
            title="Toggle theme"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {currentUser ? (
            <Link to="/dashboard" className="nav-dashboard-btn">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login"  className="nav-login-btn">Log in</Link>
              <Link to="/signup" className="nav-signup-btn">Get Started →</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-btn mobile-only"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu mobile-only">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={`mobile-nav-link ${isActive(to) ? 'active' : ''}`}>
              {label}
            </Link>
          ))}
          <div className="mobile-nav-divider" />
          <div className="mobile-nav-link" onClick={() => setIsDark(!isDark)} style={{cursor:'pointer'}}>
            {isDark ? <Sun size={16}/> : <Moon size={16}/>}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </div>
          {currentUser ? (
            <Link to="/dashboard" className="mobile-nav-link">
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login"  className="mobile-nav-link">Log in</Link>
              <Link to="/signup" className="mobile-nav-link mobile-nav-signup">Get Started Free →</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
