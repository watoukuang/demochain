## DemoChain - DemoChain区块链演示平台

### 生产部署

- 构建前端镜像

```shell
docker build -t demochain-ui:latest .
```

- 启动服务

```shell
docker run --name demochain-ui --restart=always -p 3005:3000 demochain-ui:latest
```

**常用命令**

```shell
docker run --name nginx --restart=always -p 443:443 -p 80:80 -d -v /usr/local/nginx/nginx.conf:/etc/nginx/nginx.conf -v /usr/local/web:/usr/local/web -v /usr/local/upload:/usr/local/upload nginx
```

```shell
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
```