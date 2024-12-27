import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="logo">Social Media Poster</div>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup" className="signup-btn">Sign Up</Link>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <h1>Manage Multiple Social Media Accounts with Ease</h1>
          <p>Professional tools for content creators and social media managers</p>
          <button onClick={handleGetStarted} className="cta-button">Get Started Free</button>
        </div>
      </header>

      <section className="features">
        <h2>Platform Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <i className="fas fa-upload"></i>
            <h3>Bulk Video Upload</h3>
            <p>Upload videos to multiple TikTok accounts simultaneously</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-chart-line"></i>
            <h3>Analytics Dashboard</h3>
            <p>Track performance across all your accounts</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-clock"></i>
            <h3>Scheduled Posting</h3>
            <p>Plan and schedule your content in advance</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-shield-alt"></i>
            <h3>Secure Management</h3>
            <p>Enterprise-grade security for your accounts</p>
          </div>
        </div>
      </section>

      <section className="compliance">
        <h2>TikTok Compliance</h2>
        <div className="compliance-grid">
          <div className="compliance-item">
            <h3>API Certified</h3>
            <p>Official TikTok API integration</p>
          </div>
          <div className="compliance-item">
            <h3>Data Protection</h3>
            <p>GDPR and CCPA compliant</p>
          </div>
          <div className="compliance-item">
            <h3>Safe & Secure</h3>
            <p>End-to-end encryption</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <a href="mailto:support@socialmediaposter.com">Support</a>
          </div>
          <p className="copyright">© 2024 Social Media Poster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;