import React, {useState} from 'react';
import Link from 'next/link';

// 职位数据
const jobs = [
    {
        id: 1,
        title: '高级区块链开发工程师',
        company: 'ChainTech Labs',
        location: '北京 · 朝阳区',
        salary: '40k-60k',
        type: '全职',
        experience: '5年以上',
        tags: ['Solidity', 'Go', 'DeFi'],
        logo: '🔗',
        hot: true,
        posted: '2天前',
    },
    {
        id: 2,
        title: '智能合约安全审计师',
        company: 'SecureChain',
        location: '上海 · 浦东',
        salary: '35k-55k',
        type: '全职',
        experience: '3年以上',
        tags: ['安全审计', 'Solidity', 'Rust'],
        logo: '🛡️',
        hot: true,
        posted: '1天前',
    },
    {
        id: 3,
        title: 'Web3 前端开发工程师',
        company: 'DApp Studio',
        location: '深圳 · 南山区',
        salary: '25k-40k',
        type: '全职',
        experience: '2年以上',
        tags: ['React', 'ethers.js', 'TypeScript'],
        logo: '🌐',
        hot: false,
        posted: '3天前',
    },
    {
        id: 4,
        title: '区块链产品经理',
        company: 'CryptoVentures',
        location: '杭州 · 西湖区',
        salary: '30k-50k',
        type: '全职',
        experience: '4年以上',
        tags: ['产品设计', 'DeFi', 'NFT'],
        logo: '📊',
        hot: false,
        posted: '5天前',
    },
    {
        id: 5,
        title: '共识算法研究员',
        company: 'BlockResearch',
        location: '远程',
        salary: '45k-70k',
        type: '全职',
        experience: '博士优先',
        tags: ['分布式系统', 'BFT', '密码学'],
        logo: '🔬',
        hot: true,
        posted: '1周前',
    },
    {
        id: 6,
        title: 'Rust 区块链开发',
        company: 'Substrate Labs',
        location: '成都 · 高新区',
        salary: '35k-55k',
        type: '全职',
        experience: '3年以上',
        tags: ['Rust', 'Substrate', 'Polkadot'],
        logo: '⚙️',
        hot: false,
        posted: '4天前',
    },
];

// 人才数据
const talents = [
    {
        id: 1,
        name: '张明',
        title: '资深区块链架构师',
        avatar: '👨‍💻',
        experience: '8年',
        location: '北京',
        skills: ['Solidity', 'Go', 'Rust', '系统架构'],
        intro: '曾主导多个千万级 DeFi 项目开发，精通 EVM 和 Layer2 解决方案',
        available: true,
        salary: '60k-80k',
    },
    {
        id: 2,
        name: '李雪',
        title: '智能合约开发专家',
        avatar: '👩‍💻',
        experience: '5年',
        location: '上海',
        skills: ['Solidity', 'Vyper', '安全审计', 'DeFi'],
        intro: '专注于 DeFi 协议开发，有丰富的 AMM 和借贷协议开发经验',
        available: true,
        salary: '45k-60k',
    },
    {
        id: 3,
        name: '王浩',
        title: 'Web3 全栈工程师',
        avatar: '🧑‍💻',
        experience: '4年',
        location: '深圳',
        skills: ['React', 'Node.js', 'ethers.js', 'TheGraph'],
        intro: '擅长 DApp 全栈开发，有多个 NFT 市场和 DAO 工具开发经验',
        available: false,
        salary: '35k-50k',
    },
    {
        id: 4,
        name: '陈静',
        title: '区块链安全研究员',
        avatar: '👩‍🔬',
        experience: '6年',
        location: '杭州',
        skills: ['安全审计', '漏洞分析', 'Formal Verification'],
        intro: '前知名安全公司审计负责人，发现过多个高危漏洞',
        available: true,
        salary: '50k-70k',
    },
    {
        id: 5,
        name: '刘强',
        title: '密码学工程师',
        avatar: '🧑‍🔬',
        experience: '7年',
        location: '远程',
        skills: ['ZK-SNARKs', 'MPC', '同态加密', 'Rust'],
        intro: '专注于零知识证明和隐私计算，参与过多个 ZK Rollup 项目',
        available: true,
        salary: '55k-75k',
    },
    {
        id: 6,
        name: '赵敏',
        title: '区块链产品总监',
        avatar: '👩‍💼',
        experience: '6年',
        location: '北京',
        skills: ['产品设计', '用户研究', 'DeFi', 'GameFi'],
        intro: '曾负责头部交易所产品线，对 Web3 产品有深刻理解',
        available: false,
        salary: '45k-65k',
    },
];

// 职位分类
const jobCategories = [
    {name: '全部', count: 128},
    {name: '开发', count: 56},
    {name: '安全', count: 23},
    {name: '产品', count: 18},
    {name: '研究', count: 15},
    {name: '运营', count: 16},
];

export default function Work(): React.ReactElement {
    const [activeTab, setActiveTab] = useState<'jobs' | 'talents'>('jobs');
    const [selectedCategory, setSelectedCategory] = useState('全部');
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-10 md:py-14">
            {/* 页面标题 */}
            <header className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                    Web3 人才市场
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    连接区块链行业顶尖人才与优质机会，助力 Web3 生态发展
                </p>
            </header>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    {label: '在招职位', value: '128+', icon: '💼'},
                    {label: '入驻企业', value: '56', icon: '🏢'},
                    {label: '人才库', value: '2,300+', icon: '👥'},
                    {label: '成功匹配', value: '890+', icon: '🤝'},
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border bg-white/80 backdrop-blur p-5 dark:bg-[#15161a]/80 dark:border-[#2a2c31] text-center"
                    >
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Tab 切换 */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-xl bg-gray-100 dark:bg-[#1a1d24] p-1">
                    <button
                        onClick={() => setActiveTab('jobs')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                            activeTab === 'jobs'
                                ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        💼 热门职位
                    </button>
                    <button
                        onClick={() => setActiveTab('talents')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                            activeTab === 'talents'
                                ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        👥 人才库
                    </button>
                </div>
            </div>

            {/* 搜索和筛选 */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={activeTab === 'jobs' ? '搜索职位、公司、技能...' : '搜索人才、技能...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 dark:border-[#2a2c31] bg-white dark:bg-[#1a1d24] focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    </div>
                </div>
                {activeTab === 'jobs' && (
                    <div className="flex gap-2 flex-wrap">
                        {jobCategories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    selectedCategory === cat.name
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 dark:bg-[#1a1d24] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#252830]'
                                }`}
                            >
                                {cat.name} ({cat.count})
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 职位列表 */}
            {activeTab === 'jobs' && (
                <div className="space-y-4 mb-10">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="rounded-2xl border bg-white/80 backdrop-blur p-6 dark:bg-[#15161a]/80 dark:border-[#2a2c31] hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-400 transition-all duration-300 cursor-pointer group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                {/* 公司 Logo */}
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-100 to-purple-100 dark:from-orange-500/20 dark:to-purple-500/20 flex items-center justify-center text-2xl">
                                    {job.logo}
                                </div>

                                {/* 职位信息 */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                            {job.title}
                                        </h3>
                                        {job.hot && (
                                            <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded">
                                                🔥 热招
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                        <span>{job.company}</span>
                                        <span>·</span>
                                        <span>{job.location}</span>
                                        <span>·</span>
                                        <span>{job.experience}</span>
                                        <span>·</span>
                                        <span>{job.type}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {job.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded dark:bg-orange-500/20 dark:text-orange-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 薪资和操作 */}
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                                        {job.salary}
                                    </div>
                                    <div className="text-xs text-gray-400">{job.posted}</div>
                                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-all">
                                        立即申请
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 人才列表 */}
            {activeTab === 'talents' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {talents.map((talent) => (
                        <div
                            key={talent.id}
                            className="rounded-2xl border bg-white/80 backdrop-blur p-6 dark:bg-[#15161a]/80 dark:border-[#2a2c31] hover:shadow-lg hover:border-orange-300 dark:hover:border-orange-400 transition-all duration-300 cursor-pointer group"
                        >
                            {/* 头部信息 */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-100 to-purple-100 dark:from-orange-500/20 dark:to-purple-500/20 flex items-center justify-center text-2xl">
                                    {talent.avatar}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                            {talent.name}
                                        </h3>
                                        {talent.available ? (
                                            <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded">
                                                可约聊
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 text-xs bg-gray-400 text-white rounded">
                                                暂不考虑
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{talent.title}</p>
                                </div>
                            </div>

                            {/* 基本信息 */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                <span>📍 {talent.location}</span>
                                <span>💼 {talent.experience}经验</span>
                            </div>

                            {/* 简介 */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                {talent.intro}
                            </p>

                            {/* 技能标签 */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {talent.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded dark:bg-orange-500/20 dark:text-orange-300"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* 底部 */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#2a2c31]">
                                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                    {talent.salary}
                                </div>
                                <button
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        talent.available
                                            ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:opacity-90'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                    }`}
                                    disabled={!talent.available}
                                >
                                    {talent.available ? '立即沟通' : '暂不可联系'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 企业入驻 CTA */}
            <section className="mb-10">
                <div className="bg-gradient-to-r from-orange-50 to-purple-50 dark:from-orange-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-orange-200 dark:border-orange-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                🏢 企业招聘入驻
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                发布职位，精准触达 Web3 行业优质人才，快速组建区块链团队
                            </p>
                        </div>
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-purple-600 text-white font-medium hover:opacity-90 transition-all whitespace-nowrap">
                            免费发布职位
                        </button>
                    </div>
                </div>
            </section>

            {/* 人才入驻 CTA */}
            <section className="mb-10">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                👨‍💻 人才入驻
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                展示您的技能和经验，获得优质 Web3 企业的关注和机会
                            </p>
                        </div>
                        <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-medium hover:opacity-90 transition-all whitespace-nowrap">
                            创建个人档案
                        </button>
                    </div>
                </div>
            </section>

            {/* 热门技能需求 */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold mb-6 text-center">🔥 热门技能需求</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[
                        {name: 'Solidity', demand: '高'},
                        {name: 'Rust', demand: '高'},
                        {name: 'Go', demand: '中'},
                        {name: 'ZK-SNARKs', demand: '高'},
                        {name: 'React', demand: '中'},
                        {name: 'Move', demand: '高'},
                    ].map((skill, i) => (
                        <div
                            key={i}
                            className="rounded-xl border bg-white/80 backdrop-blur p-4 dark:bg-[#15161a]/80 dark:border-[#2a2c31] text-center hover:border-orange-300 dark:hover:border-orange-400 transition-all cursor-pointer"
                        >
                            <div className="font-semibold text-gray-900 dark:text-white mb-1">{skill.name}</div>
                            <div className={`text-xs ${skill.demand === '高' ? 'text-red-500' : 'text-orange-500'}`}>
                                需求{skill.demand}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 底部联系 */}
            <section className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    有招聘需求或求职问题？
                </p>
                <Link
                    href="mailto:hr@demochain.com"
                    className="inline-flex items-center rounded-xl border px-4 py-2 hover:bg-gray-50 dark:border-[#2a2c31] dark:hover:bg-[#1a1d24] transition-all"
                >
                    联系我们
                </Link>
            </section>
        </div>
    );
}
