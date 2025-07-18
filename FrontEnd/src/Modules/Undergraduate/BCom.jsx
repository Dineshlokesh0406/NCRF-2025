import React from 'react';
import '../Primary/Primary.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faCalculator, faHandshake, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const BCom = () => {
  return (
    <div>
      <div className="module-header">
        <h1>Bachelor of Commerce (BCom)</h1>
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
              <FontAwesomeIcon icon={faChartLine} className="overview-icon" />
              <h3>Financial Accounting</h3>
              <p>Master core accounting principles, financial statements, and business mathematics</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faCalculator} className="overview-icon" />
              <h3>Business Economics</h3>
              <p>Study micro and macroeconomics, market analysis, and economic policies</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faHandshake} className="overview-icon" />
              <h3>Business Law</h3>
              <p>Learn commercial laws, corporate governance, and business ethics</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faMoneyBillWave} className="overview-icon" />
              <h3>Taxation</h3>
              <p>Understand direct and indirect taxation, tax planning, and GST</p>
            </div>
          </div>
        </section>

        <section className="year-structure">
          <h2>Year-wise Structure</h2>
          <div className="year-blocks">
            <div className="year-block">
              <h3>First Year</h3>
              <ul>
                <li>Financial Accounting</li>
                <li>Business Mathematics</li>
                <li>Business Economics</li>
                <li>Business Communication</li>
                <li>Business Organization</li>
              </ul>
              <div className="credit-info">60 Credits</div>
            </div>
            <div className="year-block">
              <h3>Second Year</h3>
              <ul>
                <li>Corporate Accounting</li>
                <li>Cost Accounting</li>
                <li>Business Law</li>
                <li>Income Tax</li>
                <li>E-Commerce</li>
              </ul>
              <div className="credit-info">60 Credits</div>
            </div>
            <div className="year-block">
              <h3>Third Year</h3>
              <ul>
                <li>Management Accounting</li>
                <li>Auditing</li>
                <li>GST and Indirect Taxes</li>
                <li>Financial Management</li>
                <li>Project Work & Internship</li>
              </ul>
              <div className="credit-info">60 Credits</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BCom;
