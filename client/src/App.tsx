import { Navbar } from './components/Navbar';
import { Editor } from './components/Editor';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#1e1e1e', color: 'white', overflow: 'hidden' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', overflow: 'hidden' }}>
        <Editor />
      </div>
    </div>
  );
}

export default App;