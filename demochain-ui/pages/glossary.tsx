import React, { useState } from 'react';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
  popularity: number; // 热门程度 1-5，5最热门
}

const glossaryData: GlossaryTerm[] = [
  // 基础概念 - 按热门程度排序
  {
    term: '区块链',
    definition: '一种分布式数据库技术，通过密码学方法将数据区块按时间顺序链接，形成不可篡改的数据链条。每个区块包含前一个区块的哈希值，确保数据的完整性和安全性。',
    category: '基础概念',
    relatedTerms: ['区块', '哈希', '分布式'],
    popularity: 5
  },
  {
    term: '比特币',
    definition: '第一个成功的加密货币，由中本聪在2009年创建。使用POW共识机制，是区块链技术的首个大规模应用。',
    category: '基础概念',
    relatedTerms: ['POW', '加密货币', '中本聪'],
    popularity: 5
  },
  {
    term: '以太坊',
    definition: '支持智能合约的区块链平台，由Vitalik Buterin创建。从POW转向POS共识机制，是DeFi和NFT的主要基础设施。',
    category: '基础概念',
    relatedTerms: ['智能合约', 'POS', 'DeFi'],
    popularity: 5
  },
  {
    term: '区块',
    definition: '区块链中的基本数据单元，包含交易数据、时间戳、前一个区块的哈希值和当前区块的哈希值。',
    category: '基础概念',
    relatedTerms: ['区块链', '哈希', '时间戳'],
    popularity: 4
  },
  {
    term: '哈希',
    definition: '一种单向加密函数，将任意长度的输入数据转换为固定长度的输出。在区块链中用于确保数据完整性。',
    category: '基础概念',
    relatedTerms: ['SHA-256', '加密', '数字指纹'],
    popularity: 4
  },

  // 共识机制
  {
    term: 'POW (工作量证明)',
    definition: '通过计算密集型的数学问题来竞争记账权的共识机制。矿工需要找到满足特定条件的随机数，比特币使用此机制。',
    category: '共识机制',
    relatedTerms: ['挖矿', '算力', '难度调整'],
    popularity: 5
  },
  {
    term: 'POS (权益证明)',
    definition: '基于持有代币数量和时间来选择验证者的共识机制。验证者需要质押代币，以太坊2.0使用此机制。',
    category: '共识机制',
    relatedTerms: ['质押', '验证者', '权益'],
    popularity: 5
  },
  {
    term: 'DPoS (委托权益证明)',
    definition: '代币持有者投票选出少数代表来负责区块生产的共识机制。提高了交易速度，EOS使用此机制。',
    category: '共识机制',
    relatedTerms: ['委托', '见证人', '投票'],
    popularity: 4
  },
  {
    term: 'BFT (拜占庭容错)',
    definition: '能够容忍网络中部分节点故障或恶意行为的共识算法。在不超过1/3的节点出现问题时仍能正常运行。',
    category: '共识机制',
    relatedTerms: ['容错', '恶意节点', '最终性'],
    popularity: 3
  },
  {
    term: 'POH (历史证明)',
    definition: 'Solana创新的共识机制，通过可验证延迟函数创建历史记录，为交易提供时间顺序证明。',
    category: '共识机制',
    relatedTerms: ['时间戳', 'VDF', '吞吐量'],
    popularity: 3
  },

  // 技术术语
  {
    term: '智能合约',
    definition: '运行在区块链上的自动执行程序，当预设条件满足时自动执行合约条款。以太坊是最著名的智能合约平台。',
    category: '技术术语',
    relatedTerms: ['以太坊', 'DApp', '自动执行'],
    popularity: 5
  },
  {
    term: 'DeFi (去中心化金融)',
    definition: '基于区块链的金融服务，无需传统金融中介。包括借贷、交易、保险等金融产品。',
    category: '技术术语',
    relatedTerms: ['智能合约', '流动性', 'AMM'],
    popularity: 5
  },
  {
    term: 'NFT (非同质化代币)',
    definition: '代表独特数字资产所有权的代币，每个NFT都是唯一的，常用于数字艺术品、游戏道具等。',
    category: '技术术语',
    relatedTerms: ['ERC-721', '数字艺术', '元宇宙'],
    popularity: 4
  },
  {
    term: '挖矿',
    definition: '在POW共识机制中，矿工通过计算哈希值来竞争记账权的过程。成功挖出区块的矿工将获得奖励。',
    category: '技术术语',
    relatedTerms: ['POW', '算力', '矿工'],
    popularity: 4
  },
  {
    term: '钱包',
    definition: '管理区块链地址和私钥的工具，用于发送、接收和存储数字资产。分为热钱包和冷钱包。',
    category: '技术术语',
    relatedTerms: ['私钥', '地址', '助记词'],
    popularity: 4
  }
];

// 区块链渐进式学习分类结构
const categoryStructure = [
  {
    name: '🎯 入门必学',
    type: 'beginner',
    count: glossaryData.filter(t => t.popularity >= 4).length,
    subcategories: [
      { name: '核心概念', filter: (t: GlossaryTerm) => ['区块链', '比特币', '以太坊'].includes(t.term) },
      { name: '基本术语', filter: (t: GlossaryTerm) => ['区块', '哈希', '钱包', '私钥'].includes(t.term) },
      { name: '交易基础', filter: (t: GlossaryTerm) => ['交易', '地址', '确认', '手续费'].includes(t.term) }
    ]
  },
  {
    name: '🔧 技术原理',
    type: 'technical',
    count: glossaryData.filter(t => ['基础概念', '共识机制'].includes(t.category)).length,
    subcategories: [
      { name: '密码学基础', filter: (t: GlossaryTerm) => ['哈希', '数字签名', '公钥', '私钥'].includes(t.term) },
      { name: '网络结构', filter: (t: GlossaryTerm) => ['P2P', '节点', '分布式', '去中心化'].includes(t.term) },
      { name: '共识机制', filter: (t: GlossaryTerm) => ['POW (工作量证明)', 'POS (权益证明)', '挖矿', '质押'].includes(t.term) },
      { name: '数据结构', filter: (t: GlossaryTerm) => ['默克尔树', '区块头', 'UTXO', '状态'].includes(t.term) }
    ]
  },
  {
    name: '💰 实用应用',
    type: 'application',
    count: 0,
    subcategories: [
      { name: '钱包使用', filter: (t: GlossaryTerm) => ['钱包', '热钱包', '冷钱包', '助记词', '私钥'].includes(t.term) },
      { name: '交易操作', filter: (t: GlossaryTerm) => ['转账', '手续费', '确认', '交易所', 'KYC'].includes(t.term) },
      { name: '安全防护', filter: (t: GlossaryTerm) => ['钓鱼攻击', '多重签名', '冷存储', '备份'].includes(t.term) },
      { name: '常见骗局', filter: (t: GlossaryTerm) => ['庞氏骗局', '拉盘砸盘', '假币', '钓鱼网站'].includes(t.term) }
    ]
  },
  {
    name: '🚀 热门应用',
    type: 'trending',
    count: 0,
    subcategories: [
      { name: 'DeFi 入门', filter: (t: GlossaryTerm) => ['DeFi (去中心化金融)', 'DEX', '流动性池', '收益农场'].includes(t.term) },
      { name: 'NFT 世界', filter: (t: GlossaryTerm) => ['NFT (非同质化代币)', '数字艺术', '铸造', 'OpenSea'].includes(t.term) },
      { name: '智能合约', filter: (t: GlossaryTerm) => ['智能合约', 'DApp', 'Gas费', 'EVM'].includes(t.term) },
      { name: '元宇宙', filter: (t: GlossaryTerm) => ['元宇宙', 'GameFi', 'P2E', '虚拟土地'].includes(t.term) }
    ]
  },
  {
    name: '📈 投资交易',
    type: 'trading',
    count: 0,
    subcategories: [
      { name: '交易基础', filter: (t: GlossaryTerm) => ['现货交易', '市价单', '限价单', '止损'].includes(t.term) },
      { name: '市场分析', filter: (t: GlossaryTerm) => ['市值', '成交量', 'K线', '技术分析'].includes(t.term) },
      { name: '风险管理', filter: (t: GlossaryTerm) => ['杠杆', '保证金', '爆仓', '仓位管理'].includes(t.term) },
      { name: '投资策略', filter: (t: GlossaryTerm) => ['定投', '网格交易', '套利', '价值投资'].includes(t.term) }
    ]
  },
  {
    name: '🔬 高级概念',
    type: 'advanced',
    count: 0,
    subcategories: [
      { name: '扩容技术', filter: (t: GlossaryTerm) => ['Layer 2', 'Rollup', '侧链', '分片'].includes(t.term) },
      { name: '跨链协议', filter: (t: GlossaryTerm) => ['跨链', '桥接', '原子交换', 'IBC'].includes(t.term) },
      { name: '隐私技术', filter: (t: GlossaryTerm) => ['零知识证明', 'zk-SNARKs', '混币', '环签名'].includes(t.term) },
      { name: '治理机制', filter: (t: GlossaryTerm) => ['DAO', '治理代币', '提案', '链上治理'].includes(t.term) }
    ]
  }
];

export default function Glossary(): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState('🎯 入门必学');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    '🎯 入门必学',
    '🔧 技术原理',
    '💰 实用应用',
    '🚀 热门应用',
    '📈 投资交易',
    '🔬 高级概念'
  ]);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 切换分类展开状态
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  // 过滤和排序术语
  const filteredTerms = glossaryData
    .filter(item => {
      const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.definition.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;

      // 如果选择了入门必学
      if (selectedCategory === '🎯 入门必学') {
        return item.popularity >= 4;
      }

      // 如果选择了子分类
      if (selectedSubcategory) {
        const category = categoryStructure.find(cat => cat.name === selectedCategory);
        const subcategory = category?.subcategories.find(sub => sub.name === selectedSubcategory);
        return subcategory ? subcategory.filter(item) : false;
      }

      // 如果选择了主分类
      return item.category === selectedCategory;
    })
    .sort((a, b) => b.popularity - a.popularity); // 按热门程度排序

  // 移除自动选择第一个术语的逻辑

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f1115]">
      {/* 左侧分类导航 */}
      <div className="w-64 bg-white dark:bg-[#1a1d24] border-r border-gray-200 dark:border-[#2a2c31] flex flex-col sticky top-0 h-screen overflow-y-auto shadow-lg dark:shadow-2xl">
        {/* 标题和搜索 */}
        <div className="p-6 border-b border-gray-200 dark:border-[#2a2c31]">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">名词解释</h1>
          
          {/* 搜索框 */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="搜索名词..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 pl-9 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-[#0f1115] dark:border-[#2a2c31] dark:text-white dark:placeholder-gray-400"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

        </div>

        {/* 分类列表 */}
        <div className="flex-1 overflow-y-auto">
          {categoryStructure.map(category => (
            <div key={category.name}>
              {/* 主分类 */}
              <button
                onClick={() => {
                  setSelectedCategory(category.name);
                  setSelectedSubcategory(null);
                  if (category.subcategories.length > 0) {
                    toggleCategory(category.name);
                  }
                }}
                className={`w-full text-left p-4 border-b border-gray-100 dark:border-[#2a2c31] hover:bg-gray-50 dark:hover:bg-[#26292e] transition-all duration-200 ${
                  selectedCategory === category.name && !selectedSubcategory ? 'bg-orange-50 dark:bg-orange-500/10 border-l-4 border-l-orange-500 dark:border-l-orange-400' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">{category.name}</h3>
                    {category.subcategories.length > 0 && (
                      <svg 
                        className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${
                          expandedCategories.includes(category.name) ? 'rotate-90' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#2a2c31] px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </div>
              </button>

              {/* 二级分类 */}
              {expandedCategories.includes(category.name) && category.subcategories.length > 0 && (
                <div className="bg-gray-50 dark:bg-[#0f1115]">
                  {category.subcategories.map(subcategory => (
                    <button
                      key={subcategory.name}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setSelectedSubcategory(subcategory.name);
                      }}
                      className={`w-full text-left p-3 pl-8 border-b border-gray-100 dark:border-[#2a2c31] hover:bg-gray-100 dark:hover:bg-[#1a1d24] transition-all duration-200 ${
                        selectedSubcategory === subcategory.name ? 'bg-orange-50 dark:bg-orange-500/10 border-l-4 border-l-orange-500 dark:border-l-orange-400' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm text-gray-700 dark:text-gray-300">{subcategory.name}</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-[#2a2c31] px-2 py-0.5 rounded-full">
                          {glossaryData.filter(subcategory.filter).length}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 右侧卡片网格 */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedSubcategory ? `${selectedCategory} - ${selectedSubcategory}` : selectedCategory}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              共 {filteredTerms.length} 个术语
            </p>
          </div>

          {/* 术语卡片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTerms.map((term, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#1a1d24] rounded-xl border border-gray-200 dark:border-[#2a2c31] p-5 hover:shadow-lg dark:hover:shadow-2xl hover:border-orange-300 dark:hover:border-orange-400 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedTerm(term)}
              >
                {/* 卡片头部 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {term.term}
                    </h3>
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-[#2a2c31] dark:text-gray-400">
                      {term.category}
                    </span>
                  </div>
                  {/* 热门程度指示器 */}
                  <div className="flex items-center gap-1 ml-2">
                    {Array.from({ length: term.popularity }, (_, i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-orange-400 dark:bg-orange-500 rounded-full"></div>
                    ))}
                  </div>
                </div>

                {/* 卡片内容 */}
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-3">
                  {term.definition}
                </p>

                {/* 相关术语标签 */}
                {term.relatedTerms && term.relatedTerms.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {term.relatedTerms.slice(0, 3).map((relatedTerm, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded dark:bg-orange-500/20 dark:text-orange-300"
                      >
                        {relatedTerm}
                      </span>
                    ))}
                    {term.relatedTerms.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                        +{term.relatedTerms.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* 查看详情指示 */}
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#2a2c31]">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    <span>点击查看详情</span>
                    <svg className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 无结果提示 */}
          {filteredTerms.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                未找到相关术语
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                尝试调整搜索关键词或选择其他分类
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 术语详情弹窗 */}
      {selectedTerm && (
        <div 
          className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTerm(null)}
        >
          <div 
            className="bg-white dark:bg-[#1a1d24] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-[#2a2c31]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#2a2c31]">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedTerm.term}
                </h2>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300">
                  {selectedTerm.category}
                </span>
                {/* 热门程度 */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < selectedTerm.popularity ? 'text-orange-400 dark:text-orange-500' : 'text-gray-300 dark:text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedTerm(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2c31] rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6">
              {/* 定义 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">定义</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {selectedTerm.definition}
                </p>
              </div>

              {/* 相关术语 */}
              {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">相关术语</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.relatedTerms.map((relatedTerm, idx) => {
                      const relatedTermData = glossaryData.find(t => t.term === relatedTerm);
                      return (
                        <button
                          key={idx}
                          onClick={() => relatedTermData && setSelectedTerm(relatedTermData)}
                          className="px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-all duration-200 dark:bg-orange-500/20 dark:text-orange-300 dark:hover:bg-orange-500/30 hover:scale-105"
                        >
                          {relatedTerm}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
