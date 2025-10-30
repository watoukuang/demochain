import React from "react";

export default function PosIcon({className = 'h-3.5 w-3.5 text-emerald-500'}: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2">
            <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"/>
            <path d="M9 12l2 2 4-4"/>
        </svg>
    )
}