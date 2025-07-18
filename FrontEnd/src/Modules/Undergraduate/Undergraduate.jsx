import React from 'react';
import { Link } from 'react-router-dom';
import './Undergraduate.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faChartLine, faBuilding } from '@fortawesome/free-solid-svg-icons';

const Undergraduate = () => {
  return (
    <div className="undergraduate-module">
      <div className="module-header">
        <h1>Undergraduate Module</h1>
        <div className="credit-summary">
          <div className="credit-item">
            <h3>Total Credits</h3>
            <p className="credit-value">180</p>
            <p className="credit-desc">Required Credits</p>
          </div>
          <div className="credit-item">
            <h3>Duration</h3>
            <p className="credit-value">4</p>
            <p className="credit-desc">Years</p>
          </div>
          <div className="credit-item">
            <h3>Credits/Year</h3>
            <p className="credit-value">45</p>
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
        <section className="program-categories">
          <h2>Choose Your Program</h2>
          <div className="category-grid">
            <Link to="/modules/undergraduate/bca" className="category-card">
              <FontAwesomeIcon icon={faLaptopCode} className="category-icon" />
              <h3>BCA</h3>
              <p>Bachelor of Computer Applications</p>
              <div className="category-badge">180 Credits</div>
            </Link>
            <Link to="/modules/undergraduate/bcom" className="category-card">
              <FontAwesomeIcon icon={faChartLine} className="category-icon" />
              <h3>BCom</h3>
              <p>Bachelor of Commerce</p>
              <div className="category-badge">180 Credits</div>
            </Link>
            <Link to="/modules/undergraduate/bba" className="category-card">
              <FontAwesomeIcon icon={faBuilding} className="category-icon" />
              <h3>BBA</h3>
              <p>Bachelor of Business Administration</p>
              <div className="category-badge">180 Credits</div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Undergraduate;
