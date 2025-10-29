import React, {useEffect, useState} from 'react'

type Consensus = 'POW' | 'POS' | 'DPoS' | 'BFT' | 'POH'

function toHex(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

async function sha256(message: string): Promise<string> {
    const enc = new TextEncoder()
    const data = enc.encode(message)
    const digest = await crypto.subtle.digest('SHA-256', data)
    return toHex(digest)
}

export default function Home(): React.ReactElement {
    // 共识机制状态
    const [consensus, setConsensus] = useState<Consensus>('POW')
    
    // SHA-256 相关状态
    const [data, setData] = useState<string>('')
    const [hash, setHash] = useState<string>('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
    const [uppercase, setUppercase] = useState<boolean>(false)
    const [copied, setCopied] = useState<boolean>(false)
    const [durationMs, setDurationMs] = useState<number>(0)

    // 从 localStorage 读取共识机制设置
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = (localStorage.getItem('consensus') as Consensus) || 'POW';
        setConsensus(saved);
    }, [])

    // 监听 localStorage 变化，实时更新共识机制
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const handleStorageChange = () => {
            const saved = (localStorage.getItem('consensus') as Consensus) || 'POW';
            setConsensus(saved);
        };

        // 监听自定义事件（当 Title 中切换共识时触发）
        window.addEventListener('consensusChanged', handleStorageChange);
        
        return () => {
            window.removeEventListener('consensusChanged', handleStorageChange);
        };
    }, [])

    useEffect(() => {
        let active = true
        const id = setTimeout(async () => {
            try {
                const t0 = performance.now()
                const h = await sha256(data)
                const t1 = performance.now()
                if (active) setHash(h)
                if (active) setDurationMs(Math.max(0, t1 - t0))
            } catch {
                // ignore
            }
        }, 200)
        return () => {
            active = false
            clearTimeout(id)
        }
    }, [data])

    // 其他共识机制的占位内容
    const renderPOSContent = () => (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">POS 权益证明</h1>
                <p className="text-gray-600 dark:text-gray-400">POS 共识机制演示即将推出...</p>
            </div>
        </div>
    )

    const renderDPoSContent = () => (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">DPoS 委托权益证明</h1>
                <p className="text-gray-600 dark:text-gray-400">DPoS 共识机制演示即将推出...</p>
            </div>
        </div>
    )

    const renderBFTContent = () => (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-4 text-pink-600 dark:text-pink-400">BFT 拜占庭容错</h1>
                <p className="text-gray-600 dark:text-gray-400">BFT 共识机制演示即将推出...</p>
            </div>
        </div>
    )

    const renderPOHContent = () => (
        <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold mb-4 text-sky-600 dark:text-sky-400">POH 历史证明</h1>
                <p className="text-gray-600 dark:text-gray-400">POH 共识机制演示即将推出...</p>
            </div>
        </div>
    )

    // 渲染不同共识机制的内容
    const renderConsensusContent = () => {
        switch (consensus) {
            case 'POW':
                return renderPOWContent()
            case 'POS':
                return renderPOSContent()
            case 'DPoS':
                return renderDPoSContent()
            case 'BFT':
                return renderBFTContent()
            case 'POH':
                return renderPOHContent()
            default:
                return renderPOWContent()
        }
    }

    // POW 内容（SHA-256 哈希演示）
    const renderPOWContent = () => (
        <div className="sha256-container px-4 py-8">
            <div className="sha256-contain max-w-4xl mx-auto">
                <p className="sha256-title text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
                    区块链<span className="sha256-highlight text-yellow-600 dark:text-yellow-500">在线演示平台</span>
                </p>
                <div
                    className="sha256-card rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 shadow-xl">
                    <div
                        className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
                        <h2 className="hash-title text-xl font-semibold text-yellow-600 dark:text-yellow-500">SHA256</h2>
                        <div className="flex items-center gap-2">
                            <button
                                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white dark:hover:bg-black/30"
                                onClick={() => setData('Hello, DemoChain!')}
                            >示例
                            </button>
                            <button
                                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white dark:hover:bg-black/30"
                                onClick={() => setData('')}
                            >清空
                            </button>
                            <button
                                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white dark:hover:bg-black/30 disabled:opacity-50"
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(uppercase ? hash.toUpperCase() : hash)
                                        setCopied(true)
                                        setTimeout(() => setCopied(false), 1200)
                                    } catch {
                                        // ignore
                                    }
                                }}
                                disabled={!hash}
                            >{copied ? '已复制' : '复制哈希'}</button>
                            <button
                                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white dark:hover:bg-black/30"
                                onClick={() => setUppercase(v => !v)}
                            >{uppercase ? '大写' : '小写'}</button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex items-start gap-4">
                            <label className="w-16 text-gray-700 dark:text-white text-sm font-medium pt-2">数据</label>
                            <div className="flex-1">
                <textarea
                    rows={8}
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    placeholder="在此输入要计算 SHA-256 的文本……"
                    autoFocus
                    className="w-full px-3 py-2 rounded resize-none bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition-colors dark:bg-black/20 dark:border-white/30 dark:text-white"
                />
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
                                    <span>字符: {data.length}</span>
                                    <span>字节: {new TextEncoder().encode(data).length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="w-16 text-gray-700 dark:text-white text-sm font-medium">哈希</label>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={uppercase ? hash.toUpperCase() : hash}
                                    disabled
                                    className="w-full px-3 py-2 rounded font-mono text-sm cursor-not-allowed opacity-75 bg-white border border-gray-300 text-gray-900 dark:bg-black/20 dark:border-white/30 dark:text-white"
                                />
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
                                    <span>长度: {(uppercase ? hash.toUpperCase() : hash).length}</span>
                                    <span>耗时: {durationMs.toFixed(1)} ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    // 主要返回逻辑
    return renderConsensusContent()
}
