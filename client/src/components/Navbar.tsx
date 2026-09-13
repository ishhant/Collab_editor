import { useState } from 'react';
import type { ActiveUser } from '../pages/Room';

interface NavbarProps {
  roomName?: string;
  activeUsers?: ActiveUser[];
}

export const Navbar = ({ roomName = 'workspace / main.js', activeUsers = [] }: NavbarProps) => {
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
          {activeUsers.map((user, index) => (
            <div 
              key={user.id}
              title={user.name}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: user.color,
                color: '#1e2227',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                border: '2px solid #181a1f',
                marginLeft: index > 0 ? '-8px' : '0',
                zIndex: activeUsers.length - index,
                textTransform: 'uppercase'
              }}
            >
              {user.name.substring(0, 2)}
            </div>
          ))}
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
