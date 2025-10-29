import React, {useState} from 'react';
import Sidebar from './components/Sidebar';
import TermsGrid from './components/TermsGrid';
import TermModal from './components/TermModal';

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
            {name: '核心概念', filter: (t: GlossaryTerm) => ['区块链', '比特币', '以太坊'].includes(t.term)},
            {name: '基本术语', filter: (t: GlossaryTerm) => ['区块', '哈希', '钱包', '私钥'].includes(t.term)},
            {name: '交易基础', filter: (t: GlossaryTerm) => ['交易', '地址', '确认', '手续费'].includes(t.term)}
        ]
    },
    {
        name: '🔧 技术原理',
        type: 'technical',
        count: glossaryData.filter(t => ['基础概念', '共识机制'].includes(t.category)).length,
        subcategories: [
            {name: '密码学基础', filter: (t: GlossaryTerm) => ['哈希', '数字签名', '公钥', '私钥'].includes(t.term)},
            {name: '网络结构', filter: (t: GlossaryTerm) => ['P2P', '节点', '分布式', '去中心化'].includes(t.term)},
            {
                name: '共识机制',
                filter: (t: GlossaryTerm) => ['POW (工作量证明)', 'POS (权益证明)', '挖矿', '质押'].includes(t.term)
            },
            {name: '数据结构', filter: (t: GlossaryTerm) => ['默克尔树', '区块头', 'UTXO', '状态'].includes(t.term)}
        ]
    },
    {
        name: '💰 实用应用',
        type: 'application',
        count: 0,
        subcategories: [
            {
                name: '钱包使用',
                filter: (t: GlossaryTerm) => ['钱包', '热钱包', '冷钱包', '助记词', '私钥'].includes(t.term)
            },
            {
                name: '交易操作',
                filter: (t: GlossaryTerm) => ['转账', '手续费', '确认', '交易所', 'KYC'].includes(t.term)
            },
            {
                name: '安全防护',
                filter: (t: GlossaryTerm) => ['钓鱼攻击', '多重签名', '冷存储', '备份'].includes(t.term)
            },
            {
                name: '常见骗局',
                filter: (t: GlossaryTerm) => ['庞氏骗局', '拉盘砸盘', '假币', '钓鱼网站'].includes(t.term)
            }
        ]
    },
    {
        name: '🚀 热门应用',
        type: 'trending',
        count: 0,
        subcategories: [
            {
                name: 'DeFi 入门',
                filter: (t: GlossaryTerm) => ['DeFi (去中心化金融)', 'DEX', '流动性池', '收益农场'].includes(t.term)
            },
            {
                name: 'NFT 世界',
                filter: (t: GlossaryTerm) => ['NFT (非同质化代币)', '数字艺术', '铸造', 'OpenSea'].includes(t.term)
            },
            {name: '智能合约', filter: (t: GlossaryTerm) => ['智能合约', 'DApp', 'Gas费', 'EVM'].includes(t.term)},
            {name: '元宇宙', filter: (t: GlossaryTerm) => ['元宇宙', 'GameFi', 'P2E', '虚拟土地'].includes(t.term)}
        ]
    },
    {
        name: '📈 投资交易',
        type: 'trading',
        count: 0,
        subcategories: [
            {name: '交易基础', filter: (t: GlossaryTerm) => ['现货交易', '市价单', '限价单', '止损'].includes(t.term)},
            {name: '市场分析', filter: (t: GlossaryTerm) => ['市值', '成交量', 'K线', '技术分析'].includes(t.term)},
            {name: '风险管理', filter: (t: GlossaryTerm) => ['杠杆', '保证金', '爆仓', '仓位管理'].includes(t.term)},
            {name: '投资策略', filter: (t: GlossaryTerm) => ['定投', '网格交易', '套利', '价值投资'].includes(t.term)}
        ]
    },
    {
        name: '🔬 高级概念',
        type: 'advanced',
        count: 0,
        subcategories: [
            {name: '扩容技术', filter: (t: GlossaryTerm) => ['Layer 2', 'Rollup', '侧链', '分片'].includes(t.term)},
            {name: '跨链协议', filter: (t: GlossaryTerm) => ['跨链', '桥接', '原子交换', 'IBC'].includes(t.term)},
            {
                name: '隐私技术',
                filter: (t: GlossaryTerm) => ['零知识证明', 'zk-SNARKs', '混币', '环签名'].includes(t.term)
            },
            {name: '治理机制', filter: (t: GlossaryTerm) => ['DAO', '治理代币', '提案', '链上治理'].includes(t.term)}
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
        <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto">
            <div className="flex min-h-screen dark:bg-[#0f1115] p-4 sm:p-6 lg:p-8">
                {/* 左侧分类导航 */}
                <Sidebar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    expandedCategories={expandedCategories}
                    onToggleCategory={toggleCategory}
                    selectedCategory={selectedCategory}
                    selectedSubcategory={selectedSubcategory}
                    onSelectCategory={(name) => { setSelectedCategory(name); setSelectedSubcategory(null); }}
                    onSelectSubcategory={(parent, name) => { setSelectedCategory(parent); setSelectedSubcategory(name); }}
                    categoryStructure={categoryStructure as any}
                    glossaryData={glossaryData}
                />

                {/* 右侧卡片网格 */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* 页面标题 */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {selectedSubcategory ? `${selectedCategory} - ${selectedSubcategory}` : selectedCategory}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">共 {filteredTerms.length} 个术语</p>
                        </div>

                        <TermsGrid terms={filteredTerms as any} onSelect={setSelectedTerm} />
                    </div>
                </div>
            </div>

            {/* 术语详情弹窗 */}
            <TermModal
                term={selectedTerm as any}
                onClose={() => setSelectedTerm(null)}
                glossaryData={glossaryData as any}
                onSelectTerm={setSelectedTerm as any}
            />
        </div>
    );
}
