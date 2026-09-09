import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import type { FileItem } from '../components/Sidebar';
import { Editor } from '../components/Editor';

const INITIAL_FILES: FileItem[] = [
  { id: '1', name: 'main.js', language: 'javascript', content: 'console.log("Hello from main.js!");' },
  { id: '2', name: 'script.py', language: 'python', content: 'print("Hello from script.py!")' },
  { id: '3', name: 'index.html', language: 'html', content: '<div class="container">\n  <h1>Hello HTML</h1>\n</div>' },
  { id: '4', name: 'styles.css', language: 'css', content: '.container {\n  color: #61afef;\n}' },
  { id: '5', name: 'data.json', language: 'json', content: '{\n  "appName": "CoSync",\n  "status": "Active"\n}' }
];

export const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();

  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState<string>('1');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("🔄 Attempting to connect to WebSocket on port 3002...");
    const ws = new WebSocket('ws://localhost:3002');
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket Connected! Joining room:", roomId);
      ws.send(JSON.stringify({
        type: 'join',
        roomId
      }));
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Received from server:", data);
      
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
      console.log("🔌 Disconnecting WebSocket...");
      ws.close();
    };
  }, [roomId]);

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
