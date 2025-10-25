import React from 'react';

export default function HashIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9h14M5 15h14"/>
      <path d="M9 3L7 21"/>
      <path d="M17 3l-2 18"/>
    </svg>
  );
}
