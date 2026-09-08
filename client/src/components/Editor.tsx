import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';

type LanguageOption = 'javascript' | 'python' | 'html' | 'css' | 'json';

const DEFAULT_CODE: Record<LanguageOption, string> = {
  javascript: 'console.log("Hello, CoSync!");',
  python: 'print("Hello, CoSync!")',
  html: '<div class="box">\n  <h1>Hello, CoSync!</h1>\n</div>',
  css: '.box {\n  color: #61afef;\n  font-family: sans-serif;\n}',
  json: '{\n  "appName": "CoSync",\n  "status": "Active"\n}',
};

export const Editor = () => {
  const [language, setLanguage] = useState<LanguageOption>('javascript');
  const [code, setCode] = useState<string>(DEFAULT_CODE['javascript']);

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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as LanguageOption;
    setLanguage(newLang);
    setCode(DEFAULT_CODE[newLang]);
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        padding: '10px 16px',
        backgroundColor: '#21252b',
        borderBottom: '1px solid #181a1f'
      }}>
        <span style={{ color: '#abb2bf', fontSize: '14px', fontWeight: 600 }}>
          Language:
        </span>
        <select
          value={language}
          onChange={handleLanguageChange}
          style={{
            backgroundColor: '#1e2227',
            color: '#61afef',
            border: '1px solid #4b5263',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '14px',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="javascript">JavaScript / TypeScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="json">JSON</option>
        </select>
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <CodeMirror
          value={code}
          height="100%"
          style={{ height: '100%' }}
          theme={oneDark}
          extensions={[getLanguageExtension(language)]}
          onChange={(val) => setCode(val)}
        />
      </div>
    </div>
  );
};