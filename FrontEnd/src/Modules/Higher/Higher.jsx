import React from 'react';
import '../Primary/Primary.css'; // Using Primary's CSS for consistent styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faSchool, faUserGraduate, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

const Higher = () => {
  return (
    <div className="higher-module">
      <div className="module-header">
        <h1>Higher Education</h1>
        <div className="credit-summary">
          <div className="credit-item">
            <h3>Total Credits</h3>
            <p className="credit-value">120</p>
            <p className="credit-desc">Required Credits</p>
          </div>
          <div className="credit-item">
            <h3>Duration</h3>
            <p className="credit-value">5</p>
            <p className="credit-desc">Years</p>
          </div>
          <div className="credit-item">
            <h3>Credits/Year</h3>
            <p className="credit-value">24</p>
            <p className="credit-desc">Average</p>
          </div>
          <div className="credit-item total">
            <h3>Learning Hours</h3>
            <p className="credit-value">3600</p>
            <p className="credit-desc">Total Hours</p>
          </div>
        </div>
      </div>

      <main className="module-content">
        <section className="program-overview">
          <h2>Program Overview</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <FontAwesomeIcon icon={faSchool} className="overview-icon" />
              <h3>High School</h3>
              <p>Grades 8–10 with a total of 72 credits and 2160 learning hours</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faUserGraduate} className="overview-icon" />
              <h3>Senior Secondary</h3>
              <p>Grades 11–12 with a total of 48 credits and 1440 learning hours</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faGraduationCap} className="overview-icon" />
              <h3>Academic Focus</h3>
              <p>Preparation for higher education with specialized subject streams</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faClipboardCheck} className="overview-icon" />
              <h3>Assessment System</h3>
              <p>Comprehensive evaluation through exams, projects and practical assessments</p>
            </div>
          </div>
        </section>

        <section className="year-structure">
          <h2>Year-wise Structure</h2>
          <div className="year-blocks">
            <div className="year-block">
              <h3>High School (8th–10th)</h3>
              <ul>
                <li>Mathematics and Sciences</li>
                <li>Languages and Literature</li>
                <li>Social Studies and Humanities</li>
                <li>Physical Education and Arts</li>
                <li>Computer Education</li>
              </ul>
              <div className="credit-info">72 Credits</div>
            </div>

            <div className="year-block">
              <h3>Senior Secondary (11th–12th)</h3>
              <ul>
                <li>Stream-based Core Subjects</li>
                <li>Science: Physics, Chemistry, Biology/Math</li>
                <li>Commerce: Accountancy, Business Studies, Economics</li>
                <li>Arts: History, Geography, Political Science</li>
                <li>Common Subjects: Language, PE, Career Guidance</li>
              </ul>
              <div className="credit-info">48 Credits</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Higher;
