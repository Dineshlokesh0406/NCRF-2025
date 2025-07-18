import React from 'react';
import './Postgraduate.css';

const Postgraduate = () => {
  return (
    <div>
      <div className="module-header">
        <h1>Postgraduate Education</h1>
        <div className="credit-summary">
          <div className="credit-item">
            <h3>Theory Credits</h3>
            <p className="credit-value">40</p>
            <p className="credit-desc">Per Semester</p>
          </div>
          <div className="credit-item">
            <h3>Research Credits</h3>
            <p className="credit-value">30</p>
            <p className="credit-desc">Per Semester</p>
          </div>
          <div className="credit-item">
            <h3>Specialization Credits</h3>
            <p className="credit-value">20</p>
            <p className="credit-desc">Per Semester</p>
          </div>
          <div className="credit-item total">
            <h3>Total Credits</h3>
            <p className="credit-value">120</p>
            <p className="credit-desc">For 2-Year Degree</p>
          </div>
        </div>
      </div>

      <main className="module-content">
        <section id="programs">
          <h2>Postgraduate Programs</h2>
          <div className="program-grid">
            <div className="program-category">
              <h3>Master of Arts (MA)</h3>
              <ul>
                <li>English (120 credits)</li>
                <li>History (120 credits)</li>
                <li>Economics (120 credits)</li>
                <li>Political Science (120 credits)</li>
                <li>Psychology (120 credits)</li>
                <li>Sociology (120 credits)</li>
              </ul>
            </div>

            <div className="program-category">
              <h3>Master of Science (MSc)</h3>
              <ul>
                <li>Physics (120 credits)</li>
                <li>Chemistry (120 credits)</li>
                <li>Mathematics (120 credits)</li>
                <li>Computer Science (120 credits)</li>
                <li>Biotechnology (120 credits)</li>
                <li>Data Science (120 credits)</li>
              </ul>
            </div>

            <div className="program-category">
              <h3>Professional Masters</h3>
              <ul>
                <li>M.Tech (120 credits)</li>
                <li>MBA (120 credits)</li>
                <li>MCA (120 credits)</li>
                <li>M.Arch (120 credits)</li>
                <li>M.Ed (120 credits)</li>
              </ul>
            </div>

            <div className="program-category">
              <h3>Specialized Programs</h3>
              <ul>
                <li>M.Phil (120 credits)</li>
                <li>M.Des (120 credits)</li>
                <li>M.Pharm (120 credits)</li>
                <li>LLM (120 credits)</li>
                <li>MFA (120 credits)</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="research-components">
          <h2>Research Components</h2>
          <div className="exit-grid">
            <div className="exit-option">
              <h3>Dissertation</h3>
              <ul>
                <li>Research Proposal</li>
                <li>Literature Review</li>
                <li>Methodology</li>
                <li>Data Analysis</li>
                <li>Final Thesis</li>
              </ul>
            </div>
            <div className="exit-option">
              <h3>Coursework</h3>
              <ul>
                <li>Core Subjects</li>
                <li>Electives</li>
                <li>Lab Work</li>
                <li>Seminars</li>
                <li>Projects</li>
              </ul>
            </div>
            <div className="exit-option">
              <h3>Assessment</h3>
              <ul>
                <li>Continuous Evaluation</li>
                <li>Term Papers</li>
                <li>Presentations</li>
                <li>Final Exams</li>
                <li>Viva Voce</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Postgraduate;
