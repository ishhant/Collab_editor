import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import type { FileItem } from '../components/Sidebar';
import { Editor } from '../components/Editor';

export interface ActiveUser {
  id: string;
  name: string;
  color: string;
}

export const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [userName, setUserName] = useState<string>('');
  const [showNamePrompt, setShowNamePrompt] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>('');
  
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
    } else {
      setShowNamePrompt(true);
      setIsLoading(false);
    }
  }, []);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      localStorage.setItem('userName', tempName.trim());
      setUserName(tempName.trim());
      setShowNamePrompt(false);
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (!userName) return;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003';
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3003';

    const cleanApiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

    const fetchRoomData = async () => {
      try {
        const response = await fetch(`${cleanApiUrl}/api/room/${roomId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setFiles(data.files);
      } catch (error) {
        console.error("Failed to fetch room data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoomData();

    console.log(`Attempting to connect to WebSocket on ${WS_URL}...`);
    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket Connected! Joining room:", roomId);
      ws.send(JSON.stringify({
        type: 'join',
        roomId,
        userName
      }));
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received from server:", data);
      
      if (data.type === 'code_change') {
        setFiles(prev => prev.map(file => {
          if (file.id === data.fileId) {
            return { ...file, content: data.content };
          }
          return file;
        }));
      } else if (data.type === 'room_users') {
        setActiveUsers(data.users);
      }
    };

    return () => {
      console.log("Disconnecting WebSocket...");
      ws.close();
    };
  }, [roomId, userName]);

  if (showNamePrompt) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#1e1e1e', color: 'white' }}>
        <h2 style={{ marginBottom: '20px', color: '#61afef' }}>Join Workspace</h2>
        <input
          type="text"
          placeholder="Enter your name..."
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
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
          onClick={handleNameSubmit}
          style={{ padding: '10px 24px', fontSize: '1rem', backgroundColor: '#98c379', color: '#1e1e1e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Join Room
        </button>
      </div>
    );
  }

  if (isLoading || files.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#1e1e1e', color: 'white' }}>
        <h2>Loading Workspace...</h2>
      </div>
    );
  }

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleCodeChange = (newContent: string) => {
    setFiles(prev => prev.map(file => {
      if (file.id === activeFileId) {
        return { ...file, content: newContent };
      }
      return file;
    }));

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'code_change',
        roomId,
        fileId: activeFileId,
        content: newContent
      }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#1e1e1e', color: 'white', overflow: 'hidden' }}>
      <Navbar roomName={`${roomId} / ${activeFile.name}`} activeUsers={activeUsers} />
      
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar
          files={files}
          activeFileId={activeFileId}
          onSelectFile={setActiveFileId}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(prev => !prev)}
        />
        
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', overflow: 'hidden' }}>
          <Editor
            language={activeFile.language}
            code={activeFile.content}
            onCodeChange={handleCodeChange}
          />
        </main>
      </div>
    </div>
  );
};
