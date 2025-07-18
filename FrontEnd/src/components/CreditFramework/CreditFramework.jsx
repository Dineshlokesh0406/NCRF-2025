import React from 'react';
import './CreditFramework.css';

const CreditFramework = () => {
  return (
    <>
      <div className="module-header">
        <h1>National Credit Framework</h1>
        <div className="credit-summary">
          <div className="credit-item">
            <h3>Academic Credits</h3>
            <p className="credit-value">1 Credit</p>
            <p className="credit-desc">= 30 Hours</p>
          </div>
          <div className="credit-item">
            <h3>Skill Credits</h3>
            <p className="credit-value">1 Credit</p>
            <p className="credit-desc">= 15 Hours</p>
          </div>
          <div className="credit-item">
            <h3>Experience Credits</h3>
            <p className="credit-value">1 Credit</p>
            <p className="credit-desc">= 30 Hours</p>
          </div>
          <div className="credit-item total">
            <h3>Maximum Hours</h3>
            <p className="credit-value">1200</p>
            <p className="credit-desc"></p>
          </div>
        </div>
      </div>

      <main className="module-content">
        <section id="credit-levels" className="credit-level-section">
          <h2>Credit Level Structure</h2>
          <div className="level-grid">
            <div className="level-card">
              <div className="level-header level-8">
                <h3>Level 8</h3>
                <p>Ph.D. / Doctorate</p>
                <span className="credit-range">Credits: 120-150</span>
              </div>
              <div className="level-content">
                <h4>Learning Hours</h4>
                <ul>
                  <li>Research Work: 2400 hours</li>
                  <li>Coursework: 480 hours</li>
                  <li>Publications: 720 hours</li>
                  <li>Total: 3600-4500 hours</li>
                </ul>
              </div>
            </div>

            <div className="level-card">
              <div className="level-header level-7">
                <h3>Level 7</h3>
                <p>Masters / PG</p>
                <span className="credit-range">Credits: 60-120</span>
              </div>
              <div className="level-content">
                <h4>Learning Hours</h4>
                <ul>
                  <li>Theory: 1200 hours</li>
                  <li>Practical: 900 hours</li>
                  <li>Research: 600 hours</li>
                  <li>Total: 1800-3600 hours</li>
                </ul>
              </div>
            </div>

            <div className="level-card">
              <div className="level-header level-6">
                <h3>Level 6</h3>
                <p>Bachelors</p>
                <span className="credit-range">Credits: 160-180</span>
              </div>
              <div className="level-content">
                <h4>Learning Hours</h4>
                <ul>
                  <li>Theory: 2700 hours</li>
                  <li>Practical: 1800 hours</li>
                  <li>Projects: 900 hours</li>
                  <li>Total: 4800-5400 hours</li>
                </ul>
              </div>
            </div>

            <div className="level-card">
              <div className="level-header level-5">
                <h3>Level 5</h3>
                <p>Higher Secondary</p>
                <span className="credit-range">Credits: 40-60</span>
              </div>
              <div className="level-content">
                <h4>Learning Hours</h4>
                <ul>
                  <li>Academic: 900 hours</li>
                  <li>Practical: 450 hours</li>
                  <li>Activities: 450 hours</li>
                  <li>Total: 1200-1800 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="credit-types" className="credit-types-section">
          <h2>Types of Credits</h2>
          <div className="credit-type-grid">
            <div className="credit-type-card academic">
              <h3>Academic Credits</h3>
              <div className="credit-details">
                <div className="credit-conversion">
                  <h4>Conversion Rate</h4>
                  <p>1 Credit = 30 Hours</p>
                </div>
                <div className="credit-components">
                  <h4>Components</h4>
                  <ul>
                    <li>Classroom Learning</li>
                    <li>Laboratory Work</li>
                    <li>Tutorials</li>
                    <li>Research Projects</li>
                  </ul>
                </div>
                <div className="credit-assessment">
                  <h4>Assessment</h4>
                  <ul>
                    <li>Written Exams</li>
                    <li>Practical Tests</li>
                    <li>Project Evaluation</li>
                    <li>Continuous Assessment</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="credit-type-card vocational">
              <h3>Vocational Credits</h3>
              <div className="credit-details">
                <div className="credit-conversion">
                  <h4>Conversion Rate</h4>
                  <p>1 Credit = 15 Hours</p>
                </div>
                <div className="credit-components">
                  <h4>Components</h4>
                  <ul>
                    <li>Skill Training</li>
                    <li>Workshops</li>
                    <li>Apprenticeship</li>
                    <li>Industry Training</li>
                  </ul>
                </div>
                <div className="credit-assessment">
                  <h4>Assessment</h4>
                  <ul>
                    <li>Skill Tests</li>
                    <li>Performance Tasks</li>
                    <li>Industry Evaluation</li>
                    <li>Portfolio Assessment</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="credit-type-card experiential">
              <h3>Experiential Credits</h3>
              <div className="credit-details">
                <div className="credit-conversion">
                  <h4>Conversion Rate</h4>
                  <p>1 Credit = 30 Hours</p>
                </div>
                <div className="credit-components">
                  <h4>Components</h4>
                  <ul>
                    <li>Work Experience</li>
                    <li>Internships</li>
                    <li>Community Service</li>
                    <li>Field Projects</li>
                  </ul>
                </div>
                <div className="credit-assessment">
                  <h4>Assessment</h4>
                  <ul>
                    <li>Work Reports</li>
                    <li>Supervisor Evaluation</li>
                    <li>Project Outcomes</li>
                    <li>Impact Assessment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="credit-mobility" className="credit-mobility-section">
          <h2>Credit Mobility & Transfer</h2>
          <div className="mobility-grid">
            <div className="mobility-card horizontal">
              <h3>Horizontal Mobility</h3>
              <div className="mobility-content">
                <p>Transfer between similar programs at the same level</p>
                <ul>
                  <li>Between Universities</li>
                  <li>Between Institutions</li>
                  <li>Between Streams</li>
                  <li>Credit Recognition: Up to 50%</li>
                </ul>
              </div>
            </div>

            <div className="mobility-card vertical">
              <h3>Vertical Mobility</h3>
              <div className="mobility-content">
                <p>Progression to higher levels of education</p>
                <ul>
                  <li>Level Advancement</li>
                  <li>Qualification Upgrade</li>
                  <li>Skill Enhancement</li>
                  <li>Credit Accumulation</li>
                </ul>
              </div>
            </div>

            <div className="mobility-card diagonal">
              <h3>Diagonal Mobility</h3>
              <div className="mobility-content">
                <p>Cross-disciplinary movement with level change</p>
                <ul>
                  <li>Field Transition</li>
                  <li>Multi-disciplinary Learning</li>
                  <li>Flexible Pathways</li>
                  <li>Credit Integration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="credit-benefits" className="benefits-section">
          <h2>Benefits of Credit Framework</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎓</div>
              <h3>Flexibility</h3>
              <ul>
                <li>Multiple Entry-Exit</li>
                <li>Credit Transfer</li>
                <li>Program Switching</li>
                <li>Customized Learning</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🌟</div>
              <h3>Recognition</h3>
              <ul>
                <li>Prior Learning</li>
                <li>Work Experience</li>
                <li>Skill Certification</li>
                <li>Global Standards</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🔄</div>
              <h3>Integration</h3>
              <ul>
                <li>Academic-Vocational</li>
                <li>Theory-Practice</li>
                <li>Industry-Academia</li>
                <li>Cross-Recognition</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Opportunities</h3>
              <ul>
                <li>Career Growth</li>
                <li>Skill Development</li>
                <li>Global Mobility</li>
                <li>Lifelong Learning</li>
              </ul>
            </div>
          </div>
        </section>
        
        <div className="cta-section">
          <h2>Ready to Plan Your Academic Journey?</h2>
          <p>Use our credit calculator to plan your educational pathway and track your progress.</p>
          <a href="/credit-calculator" className="btn primary">Calculate Credits</a>
        </div>
      </main>
    </>
  );
};

export default CreditFramework; 