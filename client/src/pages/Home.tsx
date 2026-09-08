import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const Home = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    // Generate a unique random room ID (e.g. "a1b2c3d4...")
    const newRoomId = uuidv4();
    
    // Redirect the user to the new room URL
    navigate(`/room/${newRoomId}`);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#1e1e1e',
      color: '#ffffff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', margin: '0 0 16px', color: '#61afef' }}>
        CoSync
      </h1>
      <p style={{ fontSize: '18px', color: '#abb2bf', margin: '0 0 32px' }}>
        Real-time collaborative code editor.
      </p>
      
      <button
        onClick={handleCreateRoom}
        style={{
          backgroundColor: '#98c379',
          color: '#1e1e1e',
          fontSize: '16px',
          fontWeight: 700,
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          cursor: 'pointer',
          transition: 'transform 0.1s'
        }}
        onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
      >
        Create New Workspace
      </button>
    </div>
  );
};
