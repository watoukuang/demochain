export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
}

// 全局默认 SEO 配置（DemoChain）
export const defaultSEO: SEOConfig = {
  title: 'DemoChain - 区块链共识演示平台',
  description:
    'DemoChain 是一个面向学习者与从业者的区块链共识机制可视化演示平台，支持 POW、POS、DPoS、BFT、POH 等核心模块，配合交互式控制面板与链视图，帮助快速理解区块链原理。',
  keywords:
    '区块链,Blockchain,共识机制,POW,POS,DPoS,BFT,POH,工作量证明,权益证明,委托权益证明,拜占庭容错,历史证明,哈希,区块,区块链演示,可视化',
  ogImage: '/og-image.jpg',
};

// 页面级 SEO 配置
export const pageSEO: Record<string, Partial<SEOConfig>> = {
  '/': {
    title: 'DemoChain - 区块链共识演示平台',
    description:
      '探索 POW、POS、DPoS、BFT、POH 等共识机制，通过交互式控件与链视图理解区块链运作。',
    keywords:
      '区块链演示,POW,POS,DPoS,BFT,POH,哈希,区块,链视图,教育,学习',
  },
  // POW  
  '/block': { title: '区块 - DemoChain', description: '可视化区块结构与字段组成，理解区块如何链接与验证。' },
  '/blockchain': { title: '区块链 - DemoChain', description: '观察区块串联、哈希难度与链一致性的动态变化。' },
  '/distribution': { title: '分布式 - DemoChain', description: '模拟分布式网络与挖矿过程，直观认识去中心化。' },
  '/token': { title: '代币 - DemoChain', description: '演示代币账户与交易模型，理解 UTXO/账户式差异。' },
  '/coinbase': { title: '币基奖励 - DemoChain', description: '理解出块奖励与发行机制。' },
  // POS
  '/pos/staking': { title: 'POS 质押池 - DemoChain', description: '模拟质押、赎回与余额变化，理解权益权重。' },
  '/pos/validators': { title: 'POS 验证者选择 - DemoChain', description: '基于质押权重进行概率选择，直观理解 PoS 出块者。' },
  '/pos/delegation': { title: 'POS 委托投票 - DemoChain', description: '模拟委托关系与票权累积。' },
  '/pos/slashing': { title: 'POS 惩罚机制 - DemoChain', description: '记录与展示作恶惩罚（Slashing）示例。' },
  '/pos/chain': { title: 'POS 区块链 - DemoChain', description: '以简化 PoS 逻辑生成区块并查看链结构。' },
  // DPoS
  '/dpos/candidates': { title: 'DPoS 候选人 - DemoChain', description: '管理候选人与票数，理解委托投票。' },
  '/dpos/rounds': { title: 'DPoS 出块轮次 - DemoChain', description: '轮换生产者演示出块顺序。' },
  '/dpos/vote': { title: 'DPoS 投票 - DemoChain', description: '给候选人投票并观察票数变化。' },
  '/dpos/chain': { title: 'DPoS 区块链 - DemoChain', description: '由生产者产块的简化链视图。' },
  // BFT
  '/bft/nodes': { title: 'BFT 节点状态 - DemoChain', description: '切换节点故障，观察对达成共识的影响。' },
  '/bft/steps': { title: 'BFT 流程 - DemoChain', description: 'Propose→Prevote→Precommit→Commit 的流程演示。' },
  '/bft/finality': { title: 'BFT 最终性 - DemoChain', description: '解释达到最终性的条件与效果。' },
  '/bft/chain': { title: 'BFT 区块链 - DemoChain', description: '模拟 BFT 场景下的产块与链展示。' },
  // POH
  '/poh/timeline': { title: 'POH 时序证明 - DemoChain', description: '按时间序列生成事件，展示 PoH 核心思想。' },
  '/poh/vdf': { title: 'POH VDF 演示 - DemoChain', description: '通过哈希链近似演示 VDF 延迟函数。' },
  '/poh/parallel': { title: 'POH 并行验证 - DemoChain', description: '队列 + 工作者示意并行验证思路。' },
  '/poh/chain': { title: 'POH 区块链 - DemoChain', description: '按时间顺序产块的链视图。' },
  // Pricing
  '/pricing': { title: '定价 - DemoChain', description: '免费版与付费会员：月度 $3、年度 $10、终身 $15，付费均可访问全部演示。' },
  // Glossary
  '/glossary': { title: '名词解释 - DemoChain', description: '区块链核心术语详解：POW、POS、DPoS、BFT、POH 等共识机制，智能合约、代币经济学等技术概念。' },
  // Article
  '/article': { 
    title: '文章中心 - DemoChain', 
    description: '深入探索区块链技术文章，涵盖基础知识、共识机制、智能合约、DeFi、NFT 等热门话题的专业解析。',
    keywords: '区块链文章,区块链教程,智能合约,DeFi,NFT,共识机制,区块链技术,加密货币'
  },
};

// 获取页面 SEO 配置
export function getPageSEO(pathname: string): SEOConfig {
  const pageSEOConfig = pageSEO[pathname] || {};
  return {
    ...defaultSEO,
    ...pageSEOConfig,
    ogTitle: pageSEOConfig.ogTitle || pageSEOConfig.title || defaultSEO.title,
    ogDescription: pageSEOConfig.ogDescription || pageSEOConfig.description || defaultSEO.description,
    canonical: `https://demochain.com${pathname}`,
  };
}
