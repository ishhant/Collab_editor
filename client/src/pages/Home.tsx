import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const createRoom = () => {
    if (!userName.trim()) {
      alert("Please enter your name first!");
      return;
    }
    
    localStorage.setItem('userName', userName.trim());
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#1e1e1e', color: 'white' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#61afef' }}>CoSync</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#abb2bf' }}>Real-time collaborative code editor</p>
      
      <input
        type="text"
        placeholder="Enter your name..."
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && createRoom()}
        style={{
          padding: '12px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          border: '1px solid #3e4451',
          backgroundColor: '#282c34',
          color: 'white',
          marginBottom: '20px',
          width: '250px',
          outline: 'none'
        }}
      />

      <button 
        onClick={createRoom}
        style={{ padding: '12px 24px', fontSize: '1.1rem', backgroundColor: '#98c379', color: '#1e1e1e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
      >
        Create New Workspace
      </button>
    </div>
  );
};
