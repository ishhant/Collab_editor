import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import type { FileItem } from '../components/Sidebar';
import { Editor } from '../components/Editor';

export const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003';
    const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3003';

    const fetchRoomData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/room/${roomId}`);
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
        roomId
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
      }
    };

    return () => {
      console.log("Disconnecting WebSocket...");
      ws.close();
    };
  }, [roomId]);

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
      <Navbar roomName={`${roomId} / ${activeFile.name}`} />
      
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
