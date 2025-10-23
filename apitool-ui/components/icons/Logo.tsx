import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps): React.ReactElement {
  return (
    <div className={`w-7 h-7 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg ${className || ''}`.trim()}>
      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 2.05v2.02c4.39.54 7.5 4.53 6.96 8.92A8 8 0 0 1 12 20c-4.42 0-8-3.58-8-8 0-1.57.46-3.03 1.24-4.26L6.7 6.29a10 10 0 1 0 6.25-4.24zM12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm-1-11h2v6h-2V7zm0 8h2v2h-2v-2z"/>
      </svg>
    </div>
  );
}
