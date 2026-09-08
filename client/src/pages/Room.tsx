import React, { useState } from 'react';
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

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleCodeChange = (newContent: string) => {
    setFiles(prev => prev.map(file => {
      if (file.id === activeFileId) {
        return { ...file, content: newContent };
      }
      return file;
    }));
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
