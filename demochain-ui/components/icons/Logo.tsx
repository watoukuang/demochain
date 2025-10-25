import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps): React.ReactElement {
  return (
    <div className={`w-8 h-8 relative ${className || ''}`.trim()}>
      {/* 区块链立体方块设计 */}
      <svg 
        className="w-full h-full" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 渐变定义 */}
        <defs>
          <linearGradient id="blockGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id="blockGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="blockGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        
        {/* 第一个区块 */}
        <g transform="translate(2,4)">
          <rect x="0" y="0" width="10" height="10" rx="2" fill="url(#blockGradient1)" />
          <rect x="1" y="1" width="8" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
          <circle cx="8" cy="8" r="1.5" fill="rgba(255,255,255,0.6)" />
        </g>
        
        {/* 连接线 */}
        <path d="M12 9 L20 9" stroke="url(#blockGradient2)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="9" r="1" fill="url(#blockGradient2)" />
        
        {/* 第二个区块 */}
        <g transform="translate(20,4)">
          <rect x="0" y="0" width="10" height="10" rx="2" fill="url(#blockGradient2)" />
          <rect x="1" y="1" width="8" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
          <circle cx="2" cy="8" r="1.5" fill="rgba(255,255,255,0.6)" />
        </g>
        
        {/* 第三个区块（部分显示，暗示延续） */}
        <g transform="translate(11,18)">
          <rect x="0" y="0" width="10" height="10" rx="2" fill="url(#blockGradient3)" opacity="0.8" />
          <rect x="1" y="1" width="8" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
          <circle cx="5" cy="8" r="1.5" fill="rgba(255,255,255,0.4)" />
        </g>
        
        {/* 垂直连接线 */}
        <path d="M16 14 L16 18" stroke="url(#blockGradient3)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </svg>
    </div>
  );
}
