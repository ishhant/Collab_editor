import { useState } from 'react';

interface NavbarProps {
  roomName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ roomName = 'workspace / main.js' }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      backgroundColor: '#181a1f',
      borderBottom: '1px solid #282c34',
      color: '#ffffff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '18px' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#98c379',
            display: 'inline-block'
          }} />
          <span style={{ color: '#61afef' }}>CoSync</span>
        </div>

        <div style={{
          height: '16px',
          width: '1px',
          backgroundColor: '#3e4451'
        }} />

        <span style={{ color: '#abb2bf', fontSize: '14px', fontFamily: 'monospace' }}>
          {roomName}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#e06c75',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            border: '2px solid #181a1f'
          }}>
            YOU
          </div>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#98c379',
            color: '#1e2227',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            border: '2px solid #181a1f',
            marginLeft: '-8px'
          }}>
            SK
          </div>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#d19a66',
            color: '#1e2227',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            border: '2px solid #181a1f',
            marginLeft: '-8px'
          }}>
            +1
          </div>
        </div>

        <button
          onClick={handleShare}
          style={{
            backgroundColor: copied ? '#98c379' : '#61afef',
            color: '#1e2227',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {copied ? 'Copied!' : 'Share Room'}
        </button>
      </div>
    </header>
  );
};
