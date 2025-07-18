import React from 'react';
import '../Primary/Primary.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaptopCode, faCode, faDatabase, faNetworkWired } from '@fortawesome/free-solid-svg-icons';

const BCA = () => {
  return (
    <div>
      <div className="module-header">
        <h1>Bachelor of Computer Applications (BCA)</h1>
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
              <FontAwesomeIcon icon={faLaptopCode} className="overview-icon" />
              <h3>Programming Fundamentals</h3>
              <p>Master core programming concepts and multiple languages including Java, Python, and C++</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faCode} className="overview-icon" />
              <h3>Web Development</h3>
              <p>Learn modern web technologies including HTML5, CSS3, JavaScript, and frameworks</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faDatabase} className="overview-icon" />
              <h3>Database Management</h3>
              <p>Study database design, SQL, and modern database systems</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faNetworkWired} className="overview-icon" />
              <h3>Computer Networks</h3>
              <p>Understand networking principles, protocols, and cybersecurity</p>
            </div>
          </div>
        </section>

        <section className="year-structure">
          <h2>Year-wise Structure</h2>
          <div className="year-blocks">
            <div className="year-block">
              <h3>First Year</h3>
              <ul>
                <li>Introduction to Programming</li>
                <li>Computer Organization</li>
                <li>Mathematics for Computing</li>
                <li>Digital Logic</li>
                <li>Communication Skills</li>
              </ul>
              <div className="credit-info">60 Credits</div>
            </div>
            <div className="year-block">
              <h3>Second Year</h3>
              <ul>
                <li>Data Structures and Algorithms</li>
                <li>Database Management Systems</li>
                <li>Operating Systems</li>
                <li>Web Technologies</li>
                <li>Software Engineering</li>
              </ul>
              <div className="credit-info">60 Credits</div>
            </div>
            <div className="year-block">
              <h3>Third Year</h3>
              <ul>
                <li>Advanced Web Development</li>
                <li>Mobile Application Development</li>
                <li>Computer Networks</li>
                <li>Project Work</li>
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

export default BCA;
