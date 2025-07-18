import React from 'react';
import './PhD.css';

const PhD = () => {
  return (
    <div>
      <div className="module-header">
        <h1>Ph.D. Education</h1>
        <div className="credit-summary">
          <div className="credit-item">
            <h3>Course Work Credits</h3>
            <p className="credit-value">16</p>
            <p className="credit-desc">First Year</p>
          </div>
          <div className="credit-item">
            <h3>Research Credits</h3>
            <p className="credit-value">60</p>
            <p className="credit-desc">Per Year</p>
          </div>
          <div className="credit-item">
            <h3>Publication Credits</h3>
            <p className="credit-value">24</p>
            <p className="credit-desc">Minimum Required</p>
          </div>
          <div className="credit-item total">
            <h3>Total Credits</h3>
            <p className="credit-value">180</p>
            <p className="credit-desc">For Ph.D. Degree</p>
          </div>
        </div>
      </div>

      <main className="module-content">
        <section id="programs">
          <h2>Ph.D. Research Areas</h2>
          <div className="program-grid">
            <div className="program-category">
              <h3>Arts & Humanities</h3>
              <ul>
                <li>Literature & Languages</li>
                <li>History & Archaeology</li>
                <li>Philosophy & Ethics</li>
                <li>Cultural Studies</li>
                <li>Media & Communication</li>
              </ul>
            </div>

            <div className="program-category">
              <h3>Science & Technology</h3>
              <ul>
                <li>Physics & Astronomy</li>
                <li>Chemistry & Materials</li>
                <li>Biology & Life Sciences</li>
                <li>Computer Science & AI</li>
                <li>Environmental Science</li>
              </ul>
            </div>

            <div className="program-category">
              <h3>Social Sciences</h3>
              <ul>
                <li>Economics & Finance</li>
                <li>Psychology & Behavior</li>
                <li>Sociology & Anthropology</li>
                <li>Political Science</li>
                <li>Education Research</li>
              </ul>
            </div>

            <div className="program-category">
              <h3>Professional Research</h3>
              <ul>
                <li>Engineering & Technology</li>
                <li>Medical Sciences</li>
                <li>Business & Management</li>
                <li>Law & Policy</li>
                <li>Architecture & Design</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="research-milestones" className="research-milestones">
          <h2>Research Milestones</h2>
          <div className="milestone-timeline">
            <div className="milestone-item">
              <div className="milestone-content">
                <h3>Year 1</h3>
                <ul>
                  <li>Course Work Completion (16 Credits)</li>
                  <li>Research Proposal Development</li>
                  <li>Literature Review</li>
                  <li>Methodology Planning</li>
                </ul>
              </div>
            </div>
            <div className="milestone-item">
              <div className="milestone-content">
                <h3>Year 2</h3>
                <ul>
                  <li>Data Collection</li>
                  <li>Initial Analysis</li>
                  <li>Progress Report</li>
                  <li>Conference Papers</li>
                </ul>
              </div>
            </div>
            <div className="milestone-item">
              <div className="milestone-content">
                <h3>Year 3</h3>
                <ul>
                  <li>Advanced Analysis</li>
                  <li>Journal Publications</li>
                  <li>Thesis Writing</li>
                  <li>Final Defense</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="research-components">
          <h2>Research Components</h2>
          <div className="exit-grid">
            <div className="exit-option">
              <h3>Thesis</h3>
              <ul>
                <li>Original Research Work</li>
                <li>Comprehensive Literature Review</li>
                <li>Detailed Methodology</li>
                <li>Results & Analysis</li>
                <li>Conclusions & Recommendations</li>
              </ul>
            </div>
            <div className="exit-option">
              <h3>Publications</h3>
              <ul>
                <li>Journal Articles</li>
                <li>Conference Papers</li>
                <li>Book Chapters</li>
                <li>Research Reports</li>
                <li>Patents (if applicable)</li>
              </ul>
            </div>
            <div className="exit-option">
              <h3>Presentations</h3>
              <ul>
                <li>Progress Seminars</li>
                <li>Conference Presentations</li>
                <li>Departmental Workshops</li>
                <li>Final Defense</li>
                <li>Public Engagement</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PhD;
