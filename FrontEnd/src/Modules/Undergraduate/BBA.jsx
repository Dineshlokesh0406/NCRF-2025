import React from 'react';
import '../Primary/Primary.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUsers, faChartPie, faBriefcase } from '@fortawesome/free-solid-svg-icons';

const BBA = () => {
  return (
    <div>
      <div className="module-header">
        <h1>Bachelor of Business Administration (BBA)</h1>
        <div className="credit-summary">
          <div className="credit-item">
            <h3>Total Credits</h3>
            <p className="credit-value">180</p>
            <p className="credit-desc">Required Credits</p>
          </div>
          <div className="credit-item">
            <h3>Duration</h3>
            <p className="credit-value">3</p>
            <p className="credit-desc">Years</p>
          </div>
          <div className="credit-item">
            <h3>Credits/Year</h3>
            <p className="credit-value">60</p>
            <p className="credit-desc">Average</p>
          </div>
          <div className="credit-item total">
            <h3>Learning Hours</h3>
            <p className="credit-value">5400</p>
            <p className="credit-desc">Total Hours</p>
          </div>
        </div>
      </div>

      <main className="module-content">
        <section className="program-overview">
          <h2>Program Overview</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <FontAwesomeIcon icon={faBuilding} className="overview-icon" />
              <h3>Business Management</h3>
              <p>Learn fundamental business concepts, strategies, and organizational behavior</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faUsers} className="overview-icon" />
              <h3>Human Resources</h3>
              <p>Study HR management, recruitment, training, and employee relations</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faChartPie} className="overview-icon" />
              <h3>Marketing Management</h3>
              <p>Master marketing strategies, consumer behavior, and market research</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faBriefcase} className="overview-icon" />
              <h3>Operations Management</h3>
              <p>Learn supply chain, quality management, and business operations</p>
            </div>
          </div>
        </section>

        <section className="year-structure">
          <h2>Year-wise Structure</h2>
          <div className="year-blocks">
            <div className="year-block">
              <h3>First Year</h3>
              <ul>
                <li>Principles of Management</li>
                <li>Business Mathematics</li>
                <li>Business Communication</li>
                <li>Financial Accounting</li>
                <li>Business Economics</li>
              </ul>
              <div className="credit-info">60 Credits</div>
            </div>
            <div className="year-block">
              <h3>Second Year</h3>
              <ul>
                <li>Marketing Management</li>
                <li>Human Resource Management</li>
                <li>Financial Management</li>
                <li>Business Law</li>
                <li>Operations Management</li>
              </ul>
              <div className="credit-info">60 Credits</div>
            </div>
            <div className="year-block">
              <h3>Third Year</h3>
              <ul>
                <li>Strategic Management</li>
                <li>International Business</li>
                <li>Entrepreneurship Development</li>
                <li>Project Management</li>
                <li>Industry Internship</li>
              </ul>
              <div className="credit-info">60 Credits</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BBA;
