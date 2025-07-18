import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [activePopup, setActivePopup] = useState(null);

  const openPopup = (id) => {
    setActivePopup(id);
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setActivePopup(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="header">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">New Framework</div>
            <h1>National Credit Framework <span className="highlight">(NCrF)</span></h1>
            <p className="hero-description">
              A revolutionary step in Indian education that integrates academic, vocational,
              and skill-based learning into a unified credit system.
            </p>
            <div className="hero-features">
              <div className="feature-box">
                <div className="feature-icon">🔄</div>
                <div className="feature-text">Multiple Entry-Exit Options</div>
              </div>
              <div className="feature-box">
                <div className="feature-icon">📚</div>
                <div className="feature-text">Seamless Credit Transfer</div>
              </div>
              <div className="feature-box">
                <div className="feature-icon">🏦</div>
                <div className="feature-text">Academic Bank of Credits</div>
              </div>
            </div>
            <div className="hero-buttons">
              <a href="/credit-calculator" className="btn primary">📊 Calculate Credits</a>
              <a href="/about" className="btn secondary">📖 Learn More</a>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-container">
              <img src="/img/National_Credit_Framework.png" alt="NCrF Education" />
              <div className="image-overlay">
                <a href="https://www.ugc.gov.in/pdfnews/9028476_Report-of-National-Credit-Framework.pdf" target="_blank" rel="noopener noreferrer" className="download-link">
                  <span className="download-icon">📥</span>Download Report
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to Explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Content Section */}
      <section className="content">
        <div className="content-container">
          <h2 className="section-title">Understanding the National Credit Framework (NCrF)</h2>
          <div className="boxes-grid">
            <div className="info-box" onClick={() => openPopup('introduction')}><div className="box-icon">📚</div><h3>Introduction to NCrF</h3></div>
            <div className="info-box" onClick={() => openPopup('objectives')}><div className="box-icon">🎯</div><h3>Key Objectives of NCrF</h3></div>
            <div className="info-box" onClick={() => openPopup('academic-bank')}><div className="box-icon">🏦</div><h3>Academic Bank of Credits</h3></div>
            <div className="info-box" onClick={() => openPopup('credit-system')}><div className="box-icon">📊</div><h3>Credit System</h3></div>
            <div className="info-box" onClick={() => openPopup('me-me')}><div className="box-icon">🔄</div><h3>Multiple Entry & Exit</h3></div>
          </div>
        </div>
      </section>

      {/* Overlay */}
      {activePopup && <div className="popup-overlay" onClick={closePopup}></div>}

      {/* Popups */}
      {activePopup === 'introduction' && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>&times;</span>
            <h2>Introduction to NCrF</h2>
            <p>The <strong>National Credit Framework (NCrF)</strong> is a comprehensive educational reform designed to integrate academic education, vocational training, and skill-based learning into a single credit-based system. It aligns with the <strong>National Education Policy (NEP 2020)</strong> and introduces multiple entry and exit options, lifelong learning opportunities, and a seamless credit transfer system through the <strong>Academic Bank of Credits (ABC)</strong>.</p>
          </div>
        </div>
      )}

      {activePopup === 'objectives' && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>&times;</span>
            <h2>Key Objectives of NCrF</h2>
            <ul className="styled-list">
              <li>💡 Enable <strong>flexibility</strong> in learning by allowing students to switch between <strong>academic and vocational education</strong>.</li>
              <li>📚 Implement a <strong>unified credit system</strong> across <strong>school, college, and skill development programs</strong>.</li>
              <li>🏫 Facilitate <strong>interdisciplinary learning</strong> with <strong>no hard separations</strong> between subjects.</li>
              <li>🔄 Introduce <strong>Multiple Entry and Exit (ME-ME)</strong>, allowing students to pause and resume education.</li>
              <li>🌍 Provide <strong>international recognition of Indian qualifications</strong> to enhance global opportunities.</li>
            </ul>
          </div>
        </div>
      )}

      {activePopup === 'academic-bank' && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>&times;</span>
            <h2>Academic Bank of Credits (ABC)</h2>
            <p>The <strong>Academic Bank of Credits (ABC)</strong> is a <strong>digital repository</strong> that stores all academic credits earned by a student. These credits can be <strong>accumulated, transferred, and redeemed</strong> at different educational institutions. It ensures <strong>academic mobility</strong> and allows students to transition between courses without losing previous learning.</p>
          </div>
        </div>
      )}

      {activePopup === 'credit-system' && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>&times;</span>
            <h2>Credit System in Different Education Levels</h2>
            <div className="table-container">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>Education Level</th>
                    <th>Theory Credits</th>
                    <th>Practical Credits</th>
                    <th>Experimental Learning Credits</th>
                    <th>Total Credits</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Primary</td><td>15</td><td>10</td><td>5</td><td>30</td></tr>
                  <tr><td>High School</td><td>20</td><td>15</td><td>5</td><td>40</td></tr>
                  <tr><td>Undergraduate</td><td>30</td><td>20</td><td>10</td><td>60</td></tr>
                  <tr><td>Postgraduate</td><td>35</td><td>25</td><td>10</td><td>70</td></tr>
                  <tr><td>PhD</td><td>40</td><td>30</td><td>10</td><td>80</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activePopup === 'me-me' && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>&times;</span>
            <h2>Multiple Entry & Exit (ME-ME) System</h2>
            <div className="me-me-system">
              <div className="me-me-section">
                <h3>Undergraduate Programs:</h3>
                <ul className="styled-list">
                  <li>🎓 <strong>After 1 year:</strong> Certificate</li>
                  <li>📝 <strong>After 2 years:</strong> Diploma</li>
                  <li>🎓 <strong>After 3 years:</strong> Bachelor's Degree</li>
                  <li>📝 <strong>After 4 years:</strong> Bachelor's Degree with Honors or Research</li>
                </ul>
              </div>
              <div className="me-me-section">
                <h3>Postgraduate Programs:</h3>
                <ul className="styled-list">
                  <li>📅 <strong>2-year Master's:</strong> For students with a 3-year Bachelor's degree</li>
                  <li>📅 <strong>1-year Master's:</strong> For students with a 4-year Bachelor's degree with research</li>
                  <li>📅 <strong>Integrated 5-year Bachelor's/Master's:</strong> Option to exit after 3 years with a Bachelor's degree</li>
                  <li>📅 <strong>Continue for PhD:</strong> Research-Based Degree</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
