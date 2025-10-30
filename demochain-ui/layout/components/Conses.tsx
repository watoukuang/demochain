import React, {useRef, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import PowIcon from '@/components/Icons/PowIcon';
import PosIcon from '@/components/Icons/PosIcon';
import DposIcon from '@/components/Icons/DposIcon';
import BtfIcon from '@/components/Icons/BtfIcon';
import PohIcon from '@/components/Icons/PohIcon';
import {Consensus, CONSENSUS_OPTIONS} from './Menu';

interface ConsensusSelectorProps {
    consensus: Consensus;
    setConsensus: (consensus: Consensus) => void;
}

const CONSENSUS_ICON: Record<Consensus, React.ReactNode> = {
    POW: <PowIcon/>,
    POS: <PosIcon/>,
    DPoS: <DposIcon/>,
    BFT: <BtfIcon/>,
    POH: <PohIcon/>,
};

export default function Conses({
                                   consensus,
                                   setConsensus,
                               }: ConsensusSelectorProps) {
    const consensusRef = useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const [consensusOpen, setConsensusOpen] = useState(false);

    // 点击外部关闭菜单
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!consensusRef.current) return;
            if (!consensusRef.current.contains(e.target as Node)) setConsensusOpen(false);
        };
        if (consensusOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [consensusOpen]);

    const handleConsensusChange = (opt: Consensus) => {
        setConsensus(opt);
        setConsensusOpen(false);
        if (typeof window !== 'undefined') {
            localStorage.setItem('consensus', opt);
            window.dispatchEvent(new Event('consensusChanged'));
        }
        router.push('/');
    };

    return (
        <div className="relative" ref={consensusRef}>
            <button
                onClick={() => setConsensusOpen(!consensusOpen)}
                className="h-7 px-3 inline-flex items-center gap-2 rounded-xl bg-white/90 backdrop-blur border border-gray-200 shadow-sm hover:bg-white dark:bg-[#1e1e1e]/90 dark:border-[#2d2d30] dark:text-gray-200"
                aria-haspopup="menu"
                aria-expanded={consensusOpen}
                aria-label="选择共识机制"
            >
        <span className="inline-flex items-center gap-2">
          {CONSENSUS_ICON[consensus]}
            <span className="text-sm font-semibold tracking-wide">{consensus}</span>
        </span>
                <svg className="h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>

            {consensusOpen && (
                <div
                    role="menu"
                    aria-label="共识机制"
                    className="absolute right-0 mt-2 w-56 rounded-2xl border bg-white backdrop-blur-sm shadow-lg ring-1 ring-black/5 p-2 border-gray-200 dark:bg-[#1e1e1e] dark:border-[#2d2d30] dark:ring-white/5 z-50"
                >
                    {CONSENSUS_OPTIONS.map((opt: Consensus) => (
                        <button
                            key={opt}
                            role="menuitemradio"
                            aria-checked={opt === consensus}
                            onClick={() => handleConsensusChange(opt)}
                            className={`group flex w-full items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                opt === consensus ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200'
                            }`}
                        >
              <span className="flex-1 text-left inline-flex items-center gap-2">
                {CONSENSUS_ICON[opt]}
                  <span>{opt}</span>
              </span>
                            {opt === consensus && (
                                <span aria-hidden
                                      className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"/>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
