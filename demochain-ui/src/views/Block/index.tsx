"use client"

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import * as CryptoJS from 'crypto-js'

const maxNonce = 500000

export default function Block(): React.ReactElement {
    const [height, setHeight] = useState<number>(1)
    const [nonce, setNonce] = useState<number>(72608)
    const [data, setData] = useState<string>('')
    const [hash, setHash] = useState<string>('0000f727854b50bb95c054b39c1fe5c92e5ebcfa4bcb5dc279f56aa96a365e5a')
    const [loading, setLoading] = useState<boolean>(false)
    const [difficulty, setDifficulty] = useState<number>(4)
    const pattern = useMemo(() => '0'.repeat(Math.max(0, Math.min(7, difficulty))), [difficulty])
    const [attempts, setAttempts] = useState<number>(0)
    const [durationMs, setDurationMs] = useState<number>(0)
    const isValid = useMemo(() => hash.startsWith(pattern), [hash, pattern])
    const [paused, setPaused] = useState<boolean>(false)
    const [currentNonce, setCurrentNonce] = useState<number>(0)
    const [copied, setCopied] = useState<boolean>(false)
    const pausedRef = useRef(false)
    const stopRef = useRef(false)

    const computeHash = useCallback((h: number, n: number, d: string) => {
        const str = `${h}${n}${d}`
        return CryptoJS.SHA256(str).toString()
    }, [])

    useEffect(() => {
        setHash(computeHash(height, nonce, data))
    }, [height, nonce, data, computeHash])

    const runMine = useCallback(async (startAt: number = 0) => {
        setLoading(true)
        setPaused(false)
        pausedRef.current = false
        stopRef.current = false
        const fresh = startAt === 0
        if (fresh) setAttempts(0)
        const t0 = performance.now()
        await new Promise((r) => setTimeout(r, 50))
        const localHeight = height
        const localData = data
        let foundHash = ''

        for (let i = startAt; i <= maxNonce; i++) {
            if (pausedRef.current || stopRef.current) {
                setCurrentNonce(i)
                const t1 = performance.now()
                setDurationMs(Math.max(0, t1 - t0))
                setLoading(false)
                return
            }
            const input = `${localHeight}${i}${localData}`
            const h = CryptoJS.SHA256(input).toString()
            if (h.substring(0, difficulty) === pattern) {
                setNonce(i)
                foundHash = h
                setAttempts(prev => prev + (i - startAt + 1))
                setCurrentNonce(i)
                break
            }
            if (i % 500 === 0) {
                setCurrentNonce(i)
            }
            if (i % 4000 === 0) {
                // eslint-disable-next-line no-await-in-loop
                await new Promise((r) => setTimeout(r, 0))
            }
        }

        if (foundHash) setHash(foundHash)
        const t1 = performance.now()
        setDurationMs(Math.max(0, t1 - t0))
        setLoading(false)
    }, [height, data, difficulty, pattern])

    return (
        <div className="block-page px-4 py-8">
            <div className="contain max-w-4xl mx-auto">
                <div
                    className="r-card rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 shadow-xl">
                    <div
                        className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <h2 className="block-title text-xl font-semibold leading-none text-gray-900 dark:text-yellow-500">区块</h2>
                            <span
                                className={`inline-flex items-center h-6 gap-1 px-2 rounded text-xs font-medium border ${isValid ? 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-600' : 'text-rose-700 bg-rose-50 border-rose-300 dark:text-rose-400 dark:bg-rose-500/10 dark:border-rose-600'}`}>{isValid ? '有效' : '无效'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-700 dark:text-gray-300">难度</label>
                            <input
                                type="range"
                                min={0}
                                max={7}
                                value={difficulty}
                                onChange={(e) => setDifficulty(Number(e.target.value))}
                                className="accent-yellow-500"
                            />
                            <span
                                className="w-6 text-right text-sm text-gray-700 dark:text-gray-300">{difficulty}</span>
                            <button
                                onClick={() => setData('Hello, DemoChain!')}
                                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white dark:hover:bg-black/30"
                            >示例
                            </button>
                            <button
                                onClick={() => {
                                    setData('');
                                    setNonce(1);
                                }}
                                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white dark:hover:bg-black/30"
                            >清空
                            </button>
                            <button
                                onClick={() => runMine(0)}
                                disabled={loading}
                                className="green-btn px-3 py-1.5 rounded text-sm border bg-white text-green-700 border-green-300 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-transparent dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500/10"
                            >{loading ? '⛏️ 挖矿中...' : '⛏️ 挖矿'}</button>
                            <button
                                onClick={() => {
                                    pausedRef.current = true;
                                    setPaused(true);
                                }}
                                disabled={!loading || paused}
                                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
                            >暂停
                            </button>
                            <button
                                onClick={() => runMine(currentNonce + 1)}
                                disabled={!paused}
                                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
                            >继续
                            </button>
                            <button
                                onClick={() => {
                                    stopRef.current = true;
                                    setPaused(false);
                                }}
                                disabled={!loading}
                                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
                            >停止
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        await navigator.clipboard.writeText(hash);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 1200);
                                    } catch {
                                    }
                                }}
                                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
                            >{copied ? '已复制' : '复制哈希'}</button>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex items-center">
                            <label className="w-20 text-sm font-medium text-gray-700 dark:text-white">高度</label>
                            <div className="flex-1 flex items-center">
                                <span
                                    className="inline-flex items-center h-10 px-3 bg-gray-50 border border-r-0 border-gray-300 text-gray-700 text-sm rounded-l dark:bg-black/30 dark:border-white/30 dark:text-white">#</span>
                                <input
                                    type="number"
                                    value={height}
                                    min={1}
                                    onChange={(e) => setHeight(Number(e.target.value) || 1)}
                                    className="flex-1 h-10 px-3 rounded-r bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-black/20 dark:border-white/30 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="w-20 text-sm font-medium text-gray-700 dark:text-white">随机数</label>
                            <div className="flex-1">
                                <input
                                    type="number"
                                    value={nonce}
                                    min={1}
                                    max={maxNonce}
                                    onChange={(e) => setNonce(Number(e.target.value) || 1)}
                                    className="w-full h-10 px-3 rounded bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-black/20 dark:border-white/30 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-start">
                            <label className="w-20 text-sm font-medium pt-2 text-gray-700 dark:text-white">数据</label>
                            <div className="flex-1">
                <textarea
                    rows={6}
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="w-full px-3 py-2 rounded resize-none bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-black/20 dark:border-white/30 dark:text-white"
                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <label className="w-20 text-sm font-medium text-gray-700 dark:text-white">哈希</label>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={hash}
                                    disabled
                                    className="w-full px-3 py-2 rounded text-xs font-mono cursor-not-allowed opacity-75 bg-white border border-gray-300 text-gray-900 dark:bg-black/20 dark:border-white/30 dark:text-white"
                                />
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-3">
                                    <span>尝试: {attempts.toLocaleString()}</span>
                                    <span>耗时: {durationMs.toFixed(1)} ms</span>
                                    <span>目标: {pattern || '无'}</span>
                                    <span>当前 Nonce: {currentNonce.toLocaleString()}</span>
                                </div>
                                <div className="mt-2 h-2 w-full rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 dark:bg-emerald-400 transition-[width] duration-200"
                                        style={{width: `${Math.min(100, Math.floor((currentNonce / maxNonce) * 100))}%`}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
