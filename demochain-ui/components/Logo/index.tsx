import React from "react";
import Link from "next/link";
import LogoIcon from "@/components/Icons/LogoIcon";

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <Link
            href="/"
            className={`flex items-center gap-2 whitespace-nowrap overflow-hidden min-w-0 ${className || ""}`}
            onClick={() => {
                if (typeof window !== "undefined") {
                    localStorage.setItem("consensus", "POW");
                    window.dispatchEvent(new Event("consensusChanged"));
                }
            }}
        >
      <span className="shrink-0 inline-flex scale-90">
        <LogoIcon />
      </span>
            <span
                className="truncate max-w-[40vw] sm:max-w-[50vw] md:max-w-none text-lg md:text-xl font-bold tracking-wide leading-none select-none
                   bg-gradient-to-r from-orange-500 to-purple-600
                   dark:from-orange-400 dark:to-purple-400
                   bg-clip-text text-transparent drop-shadow-sm"
            >
        DemoChain
      </span>
        </Link>
    );
};

export default Logo;
