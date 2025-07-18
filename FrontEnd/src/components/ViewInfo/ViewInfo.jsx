import React, { useState, useEffect } from 'react';
import './ViewInfo.css';

const ViewInfo = () => {
  const [content, setContent] = useState([]);

  useEffect(() => {
    // Function to fetch content from backend
    const fetchContent = async () => {
      try {
        const response = await fetch('YOUR_API_ENDPOINT_HERE');
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="viewinfo-container">
      <h2>Information</h2>
      <div className="content-grid">
        {content.map((item, index) => (
          <div key={index} className="content-item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.title} className="content-image" />
            )}
            {item.fileUrl && (
              <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                Download File
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewInfo;
