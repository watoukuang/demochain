import React from "react";
import Link from "next/link";
import LogoIcon from "@/components/Icons/LogoIcon";


const Title: React.FC = () => {
    return (
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap overflow-hidden min-w-0"
              onClick={() => {
                  if (typeof window !== 'undefined') {
                      localStorage.setItem('consensus', 'POW')
                      window.dispatchEvent(new Event('consensusChanged'))
                  }
              }}
        >
            <span className="shrink-0 inline-flex"><LogoIcon/></span>
            <span
                className="truncate max-w-[50vw] sm:max-w-[60vw] md:max-w-none text-xl md:text-2xl font-bold tracking-wide leading-none select-none bg-gradient-to-r from-orange-500 to-purple-600 dark:from-orange-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm">Demo Chain</span>
        </Link>
    );
};

export default Title;