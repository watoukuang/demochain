import { Article, ArticleCategory } from '../types/article';

export const mockArticles: Article[] = [
  {
    id: '1',
    title: '什么是区块链？从零开始理解分布式账本技术',
    slug: 'what-is-blockchain',
    excerpt: '区块链是一种分布式数据库技术，通过密码学方法将数据块按时间顺序链接，形成不可篡改的数据链。本文将从基础概念开始，深入浅出地解释区块链的工作原理。',
    content: `# 什么是区块链？

区块链（Blockchain）是一种**分布式数据库技术**，它将数据存储在一个个"区块"中，并通过密码学方法将这些区块按时间顺序链接起来，形成一个不可篡改的数据链。

## 核心特征

### 1. 去中心化
区块链网络中没有单一的控制节点，所有参与者都拥有完整的数据副本。

### 2. 不可篡改
一旦数据被写入区块链，就几乎不可能被修改或删除。

### 3. 透明性
所有交易记录都是公开透明的，任何人都可以查看。

## 工作原理

\`\`\`
1. 交易发起 → 2. 网络验证 → 3. 打包成块 → 4. 共识确认 → 5. 添加到链
\`\`\`

区块链的每个区块都包含：
- **区块头**：包含前一个区块的哈希值
- **交易数据**：该区块中的所有交易记录
- **时间戳**：区块创建的时间
- **随机数**：用于工作量证明的数值

## 应用场景

区块链技术不仅仅用于加密货币，还可以应用于：

- 供应链管理
- 数字身份认证
- 智能合约
- 版权保护
- 投票系统

## 总结

区块链作为一种革命性的技术，正在改变我们对数据存储和价值传输的理解。虽然目前还面临一些挑战，但其潜力是巨大的。`,
    author: {
      name: 'Alice Chen',
      avatar: '/avatars/alice.jpg'
    },
    category: 'blockchain-basics',
    tags: ['区块链', '基础知识', '分布式系统'],
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    readTime: 8,
    views: 1250,
    featured: true
  },
  {
    id: '2',
    title: '共识机制详解：PoW vs PoS vs DPoS',
    slug: 'consensus-mechanisms-explained',
    excerpt: '共识机制是区块链网络中确保所有节点对数据状态达成一致的核心算法。本文详细对比了工作量证明、权益证明和委托权益证明三种主流共识机制。',
    content: `# 共识机制详解

共识机制是区块链网络的核心，它确保分布式网络中的所有节点能够对数据状态达成一致。

## 工作量证明 (Proof of Work, PoW)

### 原理
矿工通过计算密集型的数学难题来竞争记账权。

### 优点
- 安全性高
- 去中心化程度高
- 经过长期验证

### 缺点
- 能耗巨大
- 交易速度慢
- 扩展性差

## 权益证明 (Proof of Stake, PoS)

### 原理
验证者根据其持有的代币数量获得记账权。

### 优点
- 能耗低
- 交易速度快
- 环保

### 缺点
- 可能导致中心化
- "无利害关系"问题

## 委托权益证明 (Delegated Proof of Stake, DPoS)

### 原理
代币持有者投票选出代表来验证交易。

### 优点
- 交易速度极快
- 能耗极低
- 治理效率高

### 缺点
- 中心化风险较高
- 依赖投票参与度

## 对比总结

| 机制 | 能耗 | 速度 | 去中心化 | 安全性 |
|------|------|------|----------|--------|
| PoW  | 高   | 慢   | 高       | 高     |
| PoS  | 低   | 中   | 中       | 中     |
| DPoS | 极低 | 快   | 低       | 中     |`,
    author: {
      name: 'Bob Zhang',
      avatar: '/avatars/bob.jpg'
    },
    category: 'consensus',
    tags: ['共识机制', 'PoW', 'PoS', 'DPoS'],
    publishedAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    readTime: 12,
    views: 890,
    featured: true
  },
  {
    id: '3',
    title: '智能合约入门：以太坊上的可编程协议',
    slug: 'smart-contracts-introduction',
    excerpt: '智能合约是运行在区块链上的自执行合约，其条款直接写入代码中。本文介绍智能合约的基本概念、工作原理和实际应用。',
    content: `# 智能合约入门

智能合约（Smart Contract）是一种运行在区块链上的**自执行合约**，合约条款直接以代码形式存在。

## 基本概念

智能合约具有以下特点：
- **自动执行**：满足条件时自动执行
- **不可篡改**：部署后无法修改
- **透明公开**：代码对所有人可见
- **无需中介**：去除第三方信任机构

## 工作原理

\`\`\`solidity
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public storedData;
    
    function set(uint256 x) public {
        storedData = x;
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}
\`\`\`

## 应用场景

### 1. 去中心化金融 (DeFi)
- 借贷协议
- 去中心化交易所
- 流动性挖矿

### 2. 数字藏品 (NFT)
- 艺术品交易
- 游戏道具
- 数字身份

### 3. 供应链管理
- 产品溯源
- 质量认证
- 物流跟踪

## 开发工具

- **Remix**：在线 IDE
- **Truffle**：开发框架
- **Hardhat**：现代化开发环境
- **MetaMask**：钱包插件

## 注意事项

智能合约开发需要特别注意：
- **安全性**：代码漏洞可能导致资金损失
- **Gas 费用**：执行成本需要优化
- **升级性**：部署后难以修改`,
    author: {
      name: 'Carol Liu',
      avatar: '/avatars/carol.jpg'
    },
    category: 'smart-contracts',
    tags: ['智能合约', '以太坊', 'Solidity', 'DeFi'],
    publishedAt: '2024-01-08T16:45:00Z',
    updatedAt: '2024-01-08T16:45:00Z',
    readTime: 10,
    views: 720,
    featured: false
  },
  {
    id: '4',
    title: 'DeFi 生态系统：去中心化金融的现状与未来',
    slug: 'defi-ecosystem-overview',
    excerpt: 'DeFi（去中心化金融）正在重塑传统金融体系。本文全面分析 DeFi 的核心协议、风险挑战和发展前景。',
    content: `# DeFi 生态系统

去中心化金融（DeFi）是基于区块链技术的金融服务生态系统，旨在重建传统金融基础设施。

## 核心协议

### 借贷协议
- **Aave**：流动性协议
- **Compound**：算法货币市场
- **MakerDAO**：去中心化稳定币

### 去中心化交易所
- **Uniswap**：自动做市商
- **SushiSwap**：社区驱动的 DEX
- **Curve**：稳定币交易专家

### 衍生品协议
- **Synthetix**：合成资产协议
- **dYdX**：去中心化衍生品交易
- **Perpetual Protocol**：永续合约

## 创新机制

### 1. 自动做市商 (AMM)
\`\`\`
价格 = Token A 储备量 / Token B 储备量
\`\`\`

### 2. 流动性挖矿
用户提供流动性获得代币奖励

### 3. 治理代币
持有者参与协议治理决策

## 风险与挑战

### 技术风险
- 智能合约漏洞
- 预言机攻击
- 前端攻击

### 市场风险
- 无常损失
- 流动性风险
- 价格波动

### 监管风险
- 合规不确定性
- 政策变化
- 地域限制

## 发展趋势

1. **跨链互操作性**
2. **Layer 2 扩容方案**
3. **机构级产品**
4. **监管合规化**
5. **用户体验改善**

DeFi 仍处于早期阶段，但已展现出巨大潜力。`,
    author: {
      name: 'David Wang',
      avatar: '/avatars/david.jpg'
    },
    category: 'defi',
    tags: ['DeFi', '去中心化金融', 'AMM', '流动性挖矿'],
    publishedAt: '2024-01-05T11:20:00Z',
    updatedAt: '2024-01-06T08:30:00Z',
    readTime: 15,
    views: 1100,
    featured: true
  },
  {
    id: '5',
    title: 'NFT 技术原理与市场分析',
    slug: 'nft-technology-and-market',
    excerpt: '非同质化代币（NFT）作为数字资产的新形式，正在艺术、游戏、元宇宙等领域掀起革命。深入了解 NFT 的技术实现和市场现状。',
    content: `# NFT 技术原理与市场分析

非同质化代币（Non-Fungible Token, NFT）是一种独特的数字资产，每个 NFT 都有唯一的标识符。

## 技术原理

### ERC-721 标准
\`\`\`solidity
interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
}
\`\`\`

### 元数据存储
- **链上存储**：数据直接存储在区块链
- **IPFS 存储**：去中心化文件系统
- **中心化存储**：传统云服务

## 应用领域

### 数字艺术
- 数字画作
- 音乐作品
- 视频内容

### 游戏资产
- 游戏角色
- 装备道具
- 虚拟土地

### 实用性 NFT
- 会员卡
- 门票
- 身份证明

## 市场现状

### 主要平台
- **OpenSea**：最大的 NFT 市场
- **SuperRare**：精品艺术平台
- **Foundation**：创作者社区

### 交易数据
- 2023 年总交易额：$230 亿
- 活跃用户：280 万
- 平均价格：$150

## 技术挑战

1. **存储问题**：元数据持久性
2. **版权保护**：原创性验证
3. **环境影响**：能耗问题
4. **互操作性**：跨平台兼容

## 未来展望

NFT 技术将向以下方向发展：
- **实用性增强**
- **碎片化交易**
- **跨链互通**
- **元宇宙集成**`,
    author: {
      name: 'Eva Chen',
      avatar: '/avatars/eva.jpg'
    },
    category: 'nft',
    tags: ['NFT', '数字艺术', 'ERC-721', '元宇宙'],
    publishedAt: '2024-01-03T09:15:00Z',
    updatedAt: '2024-01-03T09:15:00Z',
    readTime: 11,
    views: 650,
    featured: false
  }
];

export const mockCategories: ArticleCategory[] = [
  {
    id: 'blockchain-basics',
    name: '区块链基础',
    slug: 'blockchain-basics',
    description: '区块链技术的基本概念和原理',
    count: 8
  },
  {
    id: 'consensus',
    name: '共识机制',
    slug: 'consensus',
    description: '各种区块链共识算法的详解',
    count: 5
  },
  {
    id: 'smart-contracts',
    name: '智能合约',
    slug: 'smart-contracts',
    description: '智能合约开发和应用',
    count: 6
  },
  {
    id: 'defi',
    name: 'DeFi',
    slug: 'defi',
    description: '去中心化金融协议和应用',
    count: 12
  },
  {
    id: 'nft',
    name: 'NFT',
    slug: 'nft',
    description: '非同质化代币和数字资产',
    count: 4
  }
];
