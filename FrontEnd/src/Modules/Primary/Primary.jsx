import React from 'react';
import './Primary.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faPencilAlt, faUsers, faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';

const Primary = () => {
  return (
    <div>
      <div className="module-header">
        <h1>Primary Education</h1>
        <div className="credit-summary">
          <div className="credit-item">
            <h3>Total Credits</h3>
            <p className="credit-value">40</p>
            <p className="credit-desc">Per Year</p>
          </div>
          <div className="credit-item">
            <h3>Duration</h3>
            <p className="credit-value">5</p>
            <p className="credit-desc">Years</p>
          </div>
          <div className="credit-item">
            <h3>Total Credits</h3>
            <p className="credit-value">200</p>
            <p className="credit-desc">Program Total</p>
          </div>
          <div className="credit-item total">
            <h3>Learning Hours</h3>
            <p className="credit-value">6000</p>
            <p className="credit-desc">Total Hours</p>
          </div>
        </div>
      </div>

      <main className="module-content">
        <section className="program-overview">
          <h2>Program Overview</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <FontAwesomeIcon icon={faBook} className="overview-icon" />
              <h3>Core Subjects</h3>
              <p>Focus on fundamental subjects like Mathematics, Science, and Languages</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faPencilAlt} className="overview-icon" />
              <h3>Activity Based</h3>
              <p>Interactive learning through activities, projects, and hands-on experiences</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faUsers} className="overview-icon" />
              <h3>Social Skills</h3>
              <p>Development of social skills, teamwork, and communication abilities</p>
            </div>
            <div className="overview-card">
              <FontAwesomeIcon icon={faChalkboardTeacher} className="overview-icon" />
              <h3>Continuous Assessment</h3>
              <p>Regular evaluation through various assessment methods</p>
            </div>
          </div>
        </section>

        <section className="year-structure">
          <h2>Year-wise Structure</h2>
          <div className="year-blocks">
            <div className="year-block">
              <h3>Class 1</h3>
              <ul>
                <li>Basic Language Skills</li>
                <li>Number Concepts</li>
                <li>Environmental Studies</li>
                <li>Arts and Crafts</li>
                <li>Physical Activities</li>
              </ul>
              <div className="credit-info">40 Credits</div>
            </div>
            <div className="year-block">
              <h3>Class 2-3</h3>
              <ul>
                <li>Advanced Language</li>
                <li>Mathematics</li>
                <li>Science Basics</li>
                <li>Social Studies</li>
                <li>Creative Activities</li>
              </ul>
              <div className="credit-info">40 Credits/Year</div>
            </div>
            <div className="year-block">
              <h3>Class 4-5</h3>
              <ul>
                <li>Complex Language Skills</li>
                <li>Advanced Mathematics</li>
                <li>Science & Technology</li>
                <li>Social Sciences</li>
                <li>Life Skills Education</li>
              </ul>
              <div className="credit-info">40 Credits/Year</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Primary;
