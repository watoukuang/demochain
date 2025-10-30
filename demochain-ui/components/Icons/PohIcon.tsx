import React from "react";

export default function PohIcon({className = 'h-3.5 w-3.5 text-sky-500'}: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v5l3 3"/>
        </svg>
    );
}