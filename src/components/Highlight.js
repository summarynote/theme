import React from 'react';

export default function Highlight({children, color}) {
  return (
    <div>
      <span
        style={{
          backgroundColor: color,
          borderRadius: '2px',
          color: '#fff',
          padding: '0.2rem',
        }}>
        {children}
      </span>
    </div>
  );
}