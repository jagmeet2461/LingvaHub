import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import './Pages.css';

const contactInfo = [
  { icon: Mail,         label: 'Email',    value: 'support@lingvahub.com',  sub: 'We reply within 24 hours' },
  { icon: MessageSquare,label: 'Live Chat',value: 'Available in dashboard', sub: 'Mon–Fri 9am–6pm IST' },
  { icon: Clock,        label: 'Response', value: '< 24 hours',             sub: 'Average response time' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  }

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="page-hero">
        <p className="page-tag">Get In Touch</p>
        <h1 className="page-hero-title">We'd Love to <span>Hear From You</span></h1>
        <p className="page-hero-sub">Questions, feedback, partnership requests — our team is ready to help.</p>
      </div>

      <div className="contact-grid">
        {/* Info */}
        <div className="contact-info-col">
          <h2 className="contact-info-title">Contact Information</h2>
          {contactInfo.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="contact-info-card">
              <div className="contact-info-icon"><Icon size={20} /></div>
              <div>
                <p className="contact-info-label">{label}</p>
                <p className="contact-info-value">{value}</p>
                <p className="contact-info-sub">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="contact-form-card">
          {sent ? (
            <div className="contact-success">
              <CheckCircle size={48} color="#10b981" />
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              <button className="btn-hero-primary" onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }); }}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h2 className="contact-form-title">Send a Message</h2>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label>Your Name</label>
                  <input name="name" required placeholder="Your full name" value={form.name} onChange={handleChange} />
                </div>
                <div className="contact-field">
                  <label>Email</label>
                  <input name="email" type="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div className="contact-field">
                <label>Subject</label>
                <input name="subject" required placeholder="How can we help?" value={form.subject} onChange={handleChange} />
              </div>
              <div className="contact-field">
                <label>Message</label>
                <textarea name="message" required rows={5} placeholder="Tell us more..." value={form.message} onChange={handleChange} />
              </div>
              <button type="submit" className="contact-submit" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : <><Send size={17} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
