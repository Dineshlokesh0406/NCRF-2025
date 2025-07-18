import React, { useState } from 'react';
import './Achievements.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, faMedal, faStar, faAward, faGraduationCap, 
  faLaptopCode, faUsers, faChalkboardTeacher, faFlask, faBook
} from '@fortawesome/free-solid-svg-icons';

const Achievements = ({ student }) => {
  // Mock data for demonstration - would be replaced with real data from API
  const mockAchievements = [
    {
      id: 1,
      title: "Dean's List",
      description: "Achieved GPA of 9.0 or higher for the semester",
      icon: faTrophy,
      date: "2023-06-15",
      category: "Academic",
      level: "gold"
    },
    {
      id: 2,
      title: "Perfect Attendance",
      description: "Maintained 100% attendance for the semester",
      icon: faMedal,
      date: "2023-06-10",
      category: "Participation",
      level: "silver"
    },
    {
      id: 3,
      title: "Coding Champion",
      description: "Won first place in the annual coding competition",
      icon: faLaptopCode,
      date: "2023-04-22",
      category: "Competition",
      level: "gold"
    },
    {
      id: 4,
      title: "Research Excellence",
      description: "Published a research paper in a recognized journal",
      icon: faFlask,
      date: "2023-03-15",
      category: "Research",
      level: "gold"
    },
    {
      id: 5,
      title: "Team Leader",
      description: "Successfully led a team project with excellent outcomes",
      icon: faUsers,
      date: "2023-02-28",
      category: "Leadership",
      level: "silver"
    },
    {
      id: 6,
      title: "Course Completion",
      description: "Completed all core courses with distinction",
      icon: faBook,
      date: "2022-12-20",
      category: "Academic",
      level: "bronze"
    },
    {
      id: 7,
      title: "Peer Mentor",
      description: "Mentored junior students in academic subjects",
      icon: faChalkboardTeacher,
      date: "2022-11-10",
      category: "Service",
      level: "bronze"
    }
  ];

  const [achievements, setAchievements] = useState(mockAchievements);
  const [activeCategory, setActiveCategory] = useState('All');

  // Get all unique categories
  const categories = ['All', ...new Set(achievements.map(a => a.category))];

  // Filter achievements by category
  const filteredAchievements = activeCategory === 'All' 
    ? achievements 
    : achievements.filter(a => a.category === activeCategory);

  // Get badge class based on level
  const getBadgeClass = (level) => {
    switch(level) {
      case 'gold': return 'badge-gold';
      case 'silver': return 'badge-silver';
      case 'bronze': return 'badge-bronze';
      default: return 'badge-bronze';
    }
  };

  return (
    <div className="achievements-section">
      <h3 className="section-title">Achievements & Badges</h3>
      
      <div className="category-filters">
        {categories.map((category, index) => (
          <button 
            key={index} 
            className={`category-button ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="achievements-grid">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map((achievement) => (
            <div key={achievement.id} className="achievement-card">
              <div className={`achievement-icon ${getBadgeClass(achievement.level)}`}>
                <FontAwesomeIcon icon={achievement.icon} />
              </div>
              <div className="achievement-content">
                <h4 className="achievement-title">{achievement.title}</h4>
                <p className="achievement-description">{achievement.description}</p>
                <div className="achievement-meta">
                  <span className="achievement-date">
                    {new Date(achievement.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className={`achievement-level ${getBadgeClass(achievement.level)}`}>
                    {achievement.level.charAt(0).toUpperCase() + achievement.level.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-achievements">
            <FontAwesomeIcon icon={faStar} className="empty-icon" />
            <p>No achievements in this category yet</p>
          </div>
        )}
      </div>
      
      <div className="achievements-summary">
        <div className="summary-item">
          <span className="summary-value">{achievements.filter(a => a.level === 'gold').length}</span>
          <span className="summary-label">Gold</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{achievements.filter(a => a.level === 'silver').length}</span>
          <span className="summary-label">Silver</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{achievements.filter(a => a.level === 'bronze').length}</span>
          <span className="summary-label">Bronze</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{achievements.length}</span>
          <span className="summary-label">Total</span>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
