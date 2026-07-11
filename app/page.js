'use strict';
'use client';

import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyPress = async (e) => {
    // Check if the user pressed 'Enter' without holding 'Shift'
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Stop a new line from creating
      
      if (!text.trim() || isLoading) return;

      setIsLoading(true);
      const originalText = text;
      setText('Thinking...');

      try {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: originalText }),
        });

        const data = await response.json();

        if (response.ok) {
          setText(data.output); // Put Gemini's response right back into the textbox
        } else {
          setText(`Error: ${data.error || 'Something went wrong'}`);
        }
      } catch (err) {
        setText('Error: Could not connect to the backend.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      padding: '20px',
      backgroundColor: '#f5f5f7'
    }}>
      <div style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Gemini Textbox</h1>
        <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
          Write something below and press <strong>Enter</strong> to let Gemini update the text.
        </p>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          placeholder="Type your prompt here and hit Enter..."
          style={{
            width: '100%',
            height: '200px',
            padding: '15px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            resize: 'vertical',
            outline: 'none',
            backgroundColor: isLoading ? '#eef2f7' : '#fff',
            color: '#333'
          }}
        />
      </div>
    </div>
  );
}