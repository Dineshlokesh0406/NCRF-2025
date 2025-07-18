import React from 'react';

const TestComponent = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2>Test Component</h2>
      <p>This is a test component to verify that the admin page is rendering correctly.</p>
      <button 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#3498db', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Button
      </button>
    </div>
  );
};

export default TestComponent;
