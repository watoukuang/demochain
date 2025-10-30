import React, {useRef, useState, useEffect} from 'react';
import Link from 'next/link';
import NameIcon from '@/components/Icons/NameIcon';
import ArticleIcon from '@/components/Icons/ArticleIcon';
import HashIcon from '@/components/Icons/HashIcon';
import BlockIcon from '@/components/Icons/BlockIcon';
import ChainIcon from '@/components/Icons/ChainIcon';
import NetworkIcon from '@/components/Icons/NetworkIcon';
import TokenIcon from '@/components/Icons/TokenIcon';
import CoinIcon from '@/components/Icons/CoinIcon';

export type MenuItem = { name: string; href: string; icon: React.ReactNode };

// consensus type and menu config co-located here for single source of truth
export type Consensus = 'POW' | 'POS' | 'DPoS' | 'BFT' | 'POH';

export const MENUS: Record<Consensus, MenuItem[]> = {
  POW: [
    { name: '哈希', href: '/', icon: React.createElement(HashIcon, { className: 'w-5 h-5' }) },
    { name: '区块', href: '/pow/block', icon: React.createElement(BlockIcon, { className: 'w-5 h-5' }) },
    { name: '区块链', href: '/pow/blockchain', icon: React.createElement(ChainIcon, { className: 'w-5 h-5' }) },
    { name: '分布式', href: '/pow/distribution', icon: React.createElement(NetworkIcon, { className: 'w-5 h-5' }) },
    { name: '代币', href: '/pow/token', icon: React.createElement(TokenIcon, { className: 'w-5 h-5' }) },
    { name: '币基', href: '/pow/coinbase', icon: React.createElement(CoinIcon, { className: 'w-5 h-5' }) },
  ],
  POS: [
    { name: '质押池', href: '/pos/staking', icon: React.createElement(CoinIcon, { className: 'w-5 h-5' }) },
    { name: '验证者', href: '/pos/validators', icon: React.createElement(NetworkIcon, { className: 'w-5 h-5' }) },
    { name: '委托投票', href: '/pos/delegation', icon: React.createElement(TokenIcon, { className: 'w-5 h-5' }) },
    { name: '惩罚机制', href: '/pos/slashing', icon: React.createElement(HashIcon, { className: 'w-5 h-5' }) },
    { name: '区块链', href: '/pos/chain', icon: React.createElement(ChainIcon, { className: 'w-5 h-5' }) },
  ],
  DPoS: [
    { name: '候选人', href: '/dpos/candidates', icon: React.createElement(NetworkIcon, { className: 'w-5 h-5' }) },
    { name: '出块轮次', href: '/dpos/rounds', icon: React.createElement(HashIcon, { className: 'w-5 h-5' }) },
    { name: '投票与权重', href: '/dpos/vote', icon: React.createElement(TokenIcon, { className: 'w-5 h-5' }) },
    { name: '区块链', href: '/dpos/chain', icon: React.createElement(ChainIcon, { className: 'w-5 h-5' }) },
  ],
  BFT: [
    { name: '节点状态', href: '/bft/nodes', icon: React.createElement(NetworkIcon, { className: 'w-5 h-5' }) },
    { name: 'BFT 流程', href: '/bft/steps', icon: React.createElement(HashIcon, { className: 'w-5 h-5' }) },
    { name: '最终性', href: '/bft/finality', icon: React.createElement(CoinIcon, { className: 'w-5 h-5' }) },
    { name: '区块链', href: '/bft/chain', icon: React.createElement(ChainIcon, { className: 'w-5 h-5' }) },
  ],
  POH: [
    { name: '时序证明', href: '/poh/timeline', icon: React.createElement(HashIcon, { className: 'w-5 h-5' }) },
    { name: 'VDF 演示', href: '/poh/vdf', icon: React.createElement(TokenIcon, { className: 'w-5 h-5' }) },
    { name: '并行验证', href: '/poh/parallel', icon: React.createElement(NetworkIcon, { className: 'w-5 h-5' }) },
    { name: '区块链', href: '/poh/chain', icon: React.createElement(ChainIcon, { className: 'w-5 h-5' }) },
  ],
};

export const CONSENSUS_OPTIONS: Consensus[] = ['POW', 'POS', 'DPoS', 'BFT', 'POH'];

interface BaseProps {
  currentPathname: string;
  menuItems: MenuItem[];
}

interface DesktopProps extends BaseProps {
  variant: 'desktop';
}

interface MobileProps extends BaseProps {
  variant: 'mobile';
  onNavigate?: () => void;
}

type Props = DesktopProps | MobileProps;

export default function Menu(props: Props): React.ReactElement {
  const allItems: MenuItem[] = React.useMemo(() => {
    const extra: MenuItem[] = [
      { name: '名词', href: '/glossary', icon: (<NameIcon/>) },
      { name: '文章', href: '/article', icon: (<ArticleIcon/>) },
    ];
    return [...props.menuItems, ...extra];
  }, [props.menuItems]);

  if (props.variant === 'mobile') {
    const { currentPathname, onNavigate } = props;
    return (
      <div className="px-3 py-2 space-y-1">
        {allItems.map((item) => {
          const isActive = currentPathname === item.href || currentPathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-5 py-3 rounded-lg text-lg font-semibold tracking-wide flex items-center space-x-3 transition-all duration-200 ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#1a1d24]'
              }`}
              onClick={onNavigate}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  // desktop variant with overflow handling
  const { currentPathname } = props;
  const moreRef = useRef<HTMLDivElement | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!moreRef.current) return;
      if (!moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    if (moreOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moreOpen]);

  const MAX_INLINE_MD = 3;
  const inlineMd = allItems.slice(0, MAX_INLINE_MD);
  const overflowMd = allItems.slice(MAX_INLINE_MD);

  return (
    <div className="flex items-center">
      <div className="md:flex lg:hidden flex items-center space-x-1">
        {inlineMd.map((item) => {
          const isActive = currentPathname === item.href || (item.href === '/article' && currentPathname.startsWith('/article/'));
          return (
            <Link
              key={`md-${item.name}`}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 transition-all duration-200 ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#1a1d24]'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
        {overflowMd.length > 0 && (
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen(v => !v)}
              className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 transition-colors border bg-white text-gray-700 border-gray-200 hover:bg-gray-100 dark:bg-[#1a1d24] dark:text-gray-200 dark:border-[#2a2c31]"
              aria-haspopup="menu"
              aria-expanded={moreOpen}
            >
              <span>更多</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            {moreOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-48 rounded-2xl border bg-white/98 backdrop-blur-sm shadow-lg ring-1 ring-black/5 p-2 border-gray-200 dark:bg-[#1e1e1e] dark:border-[#2d2d30] dark:ring-white/5 z-50">
                {overflowMd.map((item) => {
                  const isActive = currentPathname === item.href || (item.href === '/article' && currentPathname.startsWith('/article/'));
                  return (
                    <Link
                      key={`more-${item.name}`}
                      href={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-200'}`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="hidden lg:flex items-center space-x-1">
        {allItems.map((item) => {
          const isActive = currentPathname === item.href || (item.href === '/article' && currentPathname.startsWith('/article/'));
          return (
            <Link
              key={`lg-${item.name}`}
              href={item.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center space-x-2 transition-all duration-200 ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[#1a1d24]'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

