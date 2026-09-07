import { Editor } from './components/Editor';

function App() {
  return (
    <div style={{ backgroundColor: '#1e1e1e', minHeight: '100vh', padding: '40px', color: 'white' }}>
      <h1>CoSync Editor</h1>
      <p>A beautiful collaborative workspace.</p>
      
      <Editor />
    </div>
  );
}

export default App;