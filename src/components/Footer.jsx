import React from 'react';
import { Languages, Mail, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="nav-brand-container">
            <div className="nav-logo-icon">
              <Languages size={24} />
            </div>
            <div className="nav-brand-text">
              <span className="nav-title">LingvaHub</span>
              <span className="nav-subtitle">Break Language Barriers</span>
            </div>
          </Link>
          <p className="footer-desc">
            The world's most advanced AI-powered translation platform. Communicate flawlessly across 100+ languages instantly and securely.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon"><Mail size={20} /></a>
            <a href="#" className="social-icon"><MessageCircle size={20} /></a>
            <a href="#" className="social-icon"><Share2 size={20} /></a>
          </div>
        </div>
        
        <div className="footer-col">
          <h4>Product</h4>
          <ul className="footer-links">
            <li><Link to="/translator">Translator</Link></li>
            <li><Link to="/">Document Translation</Link></li>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>Resources</h4>
          <ul className="footer-links">
            <li><Link to="/contact">Help Center</Link></li>
            <li><Link to="/features">Language Guides</Link></li>
            <li><Link to="/about">Blog</Link></li>
            <li><Link to="/about">Community</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Careers</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/pricing">Partners</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} LingvaHub Inc. All rights reserved.</p>
        <div className="footer-legal-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/contact">Cookie Settings</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
