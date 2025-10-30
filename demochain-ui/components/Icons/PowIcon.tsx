import React from "react";

export default function PowIcon({className = 'h-3.5 w-3.5 text-yellow-500'}: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/>
        </svg>
    )
}