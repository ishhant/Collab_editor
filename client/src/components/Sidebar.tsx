export interface FileItem {
  id: string;
  name: string;
  language: 'javascript' | 'python' | 'html' | 'css' | 'json';
  content: string;
}

interface SidebarProps {
  files: FileItem[];
  activeFileId: string;
  onSelectFile: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({
  files,
  activeFileId,
  onSelectFile,
  isOpen,
  onToggle
}: SidebarProps) => {
  const getFileBadgeColor = (lang: string) => {
    switch (lang) {
      case 'javascript': return '#f7df1e';
      case 'python': return '#3572A5';
      case 'html': return '#e34c26';
      case 'css': return '#563d7c';
      case 'json': return '#cb171e';
      default: return '#abb2bf';
    }
  };

  if (!isOpen) {
    return (
      <div style={{
        width: '40px',
        backgroundColor: '#181a1f',
        borderRight: '1px solid #282c34',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '12px'
      }}>
        <button
          onClick={onToggle}
          title="Open Explorer"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#abb2bf',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          📁
        </button>
      </div>
    );
  }

  return (
    <aside style={{
      width: '220px',
      backgroundColor: '#181a1f',
      borderRight: '1px solid #282c34',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid #282c34',
        color: '#5c6370',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '1px'
      }}>
        <span>EXPLORER</span>
        <button
          onClick={onToggle}
          title="Collapse Explorer"
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#abb2bf',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ◀
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
        {files.map((file) => {
          const isActive = file.id === activeFileId;
          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: isActive ? '#21252b' : 'transparent',
                borderLeft: isActive ? '3px solid #61afef' : '3px solid transparent',
                color: isActive ? '#ffffff' : '#abb2bf',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'monospace'
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getFileBadgeColor(file.language),
                display: 'inline-block'
              }} />
              <span>{file.name}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
