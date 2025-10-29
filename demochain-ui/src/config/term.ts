export interface CategoryConfig {
    name: string;
    code: string;
    subcategories: { name: string; code: string }[];
}

export const category: CategoryConfig[] = [
    {
        name: '🎯 入门必学',
        code: '01',
        subcategories: [
            {name: '核心概念', code: '0001'},
            {name: '基本术语', code: '0002'},
            {name: '交易基础', code: '0003'},
        ],
    },
    {
        name: '🔧 技术原理',
        code: '02',
        subcategories: [
            {name: '密码学基础', code: '0004'},
            {name: '网络结构', code: '0005'},
            {name: '共识机制', code: '0006'},
            {name: '数据结构', code: '0007'},
        ],
    },
    {
        name: '💰 实用应用',
        code: '03',
        subcategories: [
            {name: '钱包使用', code: '0008'},
            {name: '交易操作', code: '0009'},
            {name: '安全防护', code: '0010'},
            {name: '常见骗局', code: '0011'},
        ],
    },
    {
        name: '🚀 热门应用',
        code: '04',
        subcategories: [
            {name: 'DeFi 入门', code: '0012'},
            {name: 'NFT 世界', code: '0013'},
            {name: '智能合约', code: '0014'},
            {name: '元宇宙', code: '0015'},
        ],
    },
    {
        name: '📈 投资交易',
        code: '05',
        subcategories: [
            {name: '交易基础', code: '0016'},
            {name: '市场分析', code: '0017'},
            {name: '风险管理', code: '0018'},
            {name: '投资策略', code: '0019'},
        ],
    },
    {
        name: '🔬 高级概念',
        code: '06',
        subcategories: [
            {name: '扩容技术', code: '0020'},
            {name: '跨链协议', code: '0021'},
            {name: '隐私技术', code: '0022'},
            {name: '治理机制', code: '0023'},
        ],
    },
];
