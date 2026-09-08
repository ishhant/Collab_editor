import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

export type LanguageOption = 'javascript' | 'python' | 'html' | 'css' | 'json';

interface EditorProps {
  language: LanguageOption;
  code: string;
  onCodeChange: (newCode: string) => void;
}

export const Editor: React.FC<EditorProps> = ({
  language,
  code,
  onCodeChange
}) => {
  const getLanguageExtension = (lang: LanguageOption) => {
    switch (lang) {
      case 'python':
        return python();
      case 'html':
        return html();
      case 'css':
        return css();
      case 'json':
        return json();
      case 'javascript':
      default:
        return javascript({ jsx: true });
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      border: '1px solid #333',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#282c34'
    }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <CodeMirror
          value={code}
          height="100%"
          style={{ height: '100%' }}
          theme={oneDark}
          extensions={[getLanguageExtension(language)]}
          onChange={(val) => onCodeChange(val)}
        />
      </div>
    </div>
  );
};