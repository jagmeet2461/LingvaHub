import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Crown, Star, Languages, FileText, MessageSquare } from 'lucide-react';
import './Pages.css';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    color: '#6366f1',
    icon: Languages,
    features: [
      '5,000 characters / day',
      '100+ languages',
      'Text translation',
      'TXT file translation',
      'Chat translator',
      'Browser-based (no install)',
    ],
    cta: 'Get Started Free',
    ctaLink: '/signup',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹799',
    period: '/month',
    color: '#8b5cf6',
    icon: Crown,
    features: [
      'Unlimited characters',
      '100+ languages',
      'PDF + DOCX translation',
      'Gemini 1.5 Flash AI',
      'Voice-to-voice translation',
      'Translation history',
      'Priority support',
      'API access (coming soon)',
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/signup',
    highlight: true,
  },
  {
    name: 'Business',
    price: '₹2,999',
    period: '/month',
    color: '#f59e0b',
    icon: Star,
    features: [
      'Everything in Pro',
      'Team collaboration (5 seats)',
      'Custom AI fine-tuning',
      'Bulk document translation',
      'Dedicated account manager',
      'SLA & uptime guarantee',
      'White-label option',
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
    highlight: false,
  },
];

const faqs = [
  { q: 'Is the free plan really free?', a: 'Yes! The Free plan is completely free with no credit card required. You get 5,000 characters per day across all features.' },
  { q: 'Can I cancel my Pro subscription anytime?', a: 'Absolutely. Cancel anytime from your dashboard. You keep access until the end of your billing period.' },
  { q: 'What file formats does Pro support?', a: 'Pro supports PDF, DOCX, and TXT file translation with AI-powered accuracy using Gemini 1.5 Flash.' },
  { q: 'Is there a student discount?', a: 'Yes! Students get 50% off Pro. Email us with your student ID at support@lingvahub.com.' },
];

export default function Pricing() {
  return (
    <div className="page-container">
      {/* Hero */}
      <div className="page-hero pricing-hero">
        <p className="page-tag">Simple Pricing</p>
        <h1 className="page-hero-title">Choose Your <span>Plan</span></h1>
        <p className="page-hero-sub">Start free. Upgrade when you need more power. No surprises.</p>
      </div>

      {/* Plans */}
      <div className="pricing-grid">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div key={plan.name} className={`pricing-card ${plan.highlight ? 'pricing-card--highlight' : ''}`}>
              {plan.highlight && <div className="pricing-popular">Most Popular</div>}
              <div className="pricing-card-header">
                <div className="pricing-icon" style={{ background: `${plan.color}18`, color: plan.color }}>
                  <Icon size={22} />
                </div>
                <h2 className="pricing-name">{plan.name}</h2>
              </div>
              <div className="pricing-price">
                <span className="pricing-amount">{plan.price}</span>
                <span className="pricing-period">{plan.period}</span>
              </div>
              <ul className="pricing-features">
                {plan.features.map(f => (
                  <li key={f} className="pricing-feature">
                    <Check size={15} className="pricing-check" style={{ color: plan.color }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.ctaLink}
                className="pricing-cta"
                style={plan.highlight ? { background: `linear-gradient(135deg, #6366f1, #8b5cf6)` } : {}}
              >
                {plan.cta}
              </Link>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="page-section faq-section">
        <h2 className="page-section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          {faqs.map(({ q, a }) => (
            <div key={q} className="faq-card">
              <h3 className="faq-q">{q}</h3>
              <p className="faq-a">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="page-cta-banner">
        <h2>Ready to break language barriers?</h2>
        <p>Join thousands of users translating smarter with Gemini AI.</p>
        <div className="page-cta-btns">
          <Link to="/signup" className="btn-hero-primary">Start Free →</Link>
          <Link to="/translator" className="btn-hero-secondary">Try Translator</Link>
        </div>
      </div>
    </div>
  );
}
