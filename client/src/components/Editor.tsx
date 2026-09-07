import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

export const Editor = () => {
  const [code, setCode] = useState('console.log("Hello, CoSync!");');

  const onChange = (value: string) => {
    setCode(value);
  };

  return (
    <div style={{ border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
      <CodeMirror
        value={code}
        height="500px"
        theme={oneDark}
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />
    </div>
  );
};