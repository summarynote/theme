import React from 'react';
import columnstyles from './columnstyles.modules.css';

export function Row({children}) {
  return (
    <div className={columnstyles.row}>
      {children}
    </div>
  );
}

export function Column({children}) {
  return (
    <div className={columnstyles.column}>
      {children}
    </div>
  );
}