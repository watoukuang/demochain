"use client"

import React, {useCallback, useEffect, useRef, useState, useMemo} from 'react'
import BlockCard from '@/components/blockchain/BlockCard'
import XData, {XDataRef} from '@/components/blockchain/XData'
import type {Block} from '@/types/blockchain'
import * as CryptoJS from 'crypto-js'

const maxNonce = 500000
const genesisHash = '0000000000000000000000000000000000000000000000000000000000000000'

export default function BlockchainPage(): React.ReactElement {
    const dataRef = useRef<XDataRef | null>(null)
    const [difficulty, setDifficulty] = useState<number>(4)
    const [loading, setLoading] = useState<boolean>(false)
    const [paused, setPaused] = useState<boolean>(false)
    const [attempts, setAttempts] = useState<number>(0)
    const [currentNonce, setCurrentNonce] = useState<number>(0)
    const [durationMs, setDurationMs] = useState<number>(0)
    const pausedRef = useRef(false)
    const stopRef = useRef(false)
    const [pendingData, setPendingData] = useState<string>('')
    const [blocks, setBlocks] = useState<Block[]>([
        {
            height: 1,
            nonce: 72608,
            data: 'Genesis block',
            previous: genesisHash,
            timestamp: 1640995200000, // 固定时间戳避免水合错误
            hash: '0000f727854b50bb95c054b39c1fe5c92e5ebcfa4bcb5dc279f56aa96a365e5a'
        }
    ])

    // 客户端初始化时更新创世区块时间戳
    useEffect(() => {
        setBlocks(prev => [
            {
                ...prev[0],
                timestamp: Date.now()
            }
        ])
    }, [])

    const pattern = useMemo(() => '0'.repeat(Math.max(0, Math.min(7, difficulty))), [difficulty])
    const currentBlock = blocks[blocks.length - 1]
    const nextHeight = currentBlock.height + 1

    const computeHash = useCallback((b: Block) => {
        const str = `${b.height}${b.nonce}${b.previous}${b.timestamp}${b.data}`
        return CryptoJS.SHA256(str).toString()
    }, [])

    const updateData = (val: string) => {
        setPendingData(val)
    }

    const addNewBlock = useCallback(() => {
        const newBlock: Block = {
            height: nextHeight,
            nonce: 1,
            data: pendingData,
            previous: currentBlock.hash,
            timestamp: Date.now(),
            hash: ''
        }
        const hash = computeHash(newBlock)
        const blockWithHash = {...newBlock, hash}
        setBlocks(prev => [...prev, blockWithHash])
        setPendingData('')
        dataRef.current?.reset()
    }, [nextHeight, pendingData, currentBlock.hash, computeHash])

    const resetChain = useCallback(() => {
        setBlocks([{
            height: 1,
            nonce: 72608,
            data: 'Genesis block',
            previous: genesisHash,
            timestamp: Date.now(),
            hash: '0000f727854b50bb95c054b39c1fe5c92e5ebcfa4bcb5dc279f56aa96a365e5a'
        }])
        setPendingData('')
        dataRef.current?.reset()
    }, [])

    const runMine = useCallback(async (startAt: number = 0) => {
        if (!pendingData.trim()) {
            alert('请先输入区块数据！')
            return
        }

        setLoading(true)
        setPaused(false)
        pausedRef.current = false
        stopRef.current = false
        const fresh = startAt === 0
        if (fresh) setAttempts(0)
        const t0 = performance.now()
        await new Promise((r) => setTimeout(r, 50))

        const localHeight = nextHeight
        const localData = pendingData
        const localPrevious = currentBlock.hash
        const localTimestamp = Date.now()
        let foundNonce = 0
        let foundHash = ''

        for (let i = startAt; i <= maxNonce; i++) {
            if (pausedRef.current || stopRef.current) {
                setCurrentNonce(i)
                const t1 = performance.now()
                setDurationMs(Math.max(0, t1 - t0))
                setLoading(false)
                return
            }
            const input = `${localHeight}${i}${localPrevious}${localTimestamp}${localData}`
            const h = CryptoJS.SHA256(input).toString()
            if (h.substring(0, difficulty) === pattern) {
                foundNonce = i
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

        if (foundHash) {
            // 挖矿成功，添加新区块到链中
            const newBlock: Block = {
                height: localHeight,
                nonce: foundNonce,
                data: localData,
                previous: localPrevious,
                timestamp: localTimestamp,
                hash: foundHash
            }
            setBlocks(prev => [...prev, newBlock])
            setPendingData('')
            dataRef.current?.reset()
        }

        const t1 = performance.now()
        setDurationMs(Math.max(0, t1 - t0))
        setLoading(false)
    }, [nextHeight, pendingData, currentBlock.hash, difficulty, pattern])

    return (
        <div className="px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* 控制面板 */}
                <div
                    className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">区块链演示</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">难度</label>
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
                            </div>
                            <button
                                onClick={resetChain}
                                disabled={loading}
                                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
                            >重置链
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            <span>当前链长度: {blocks.length} | 下一区块高度: {nextHeight}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => runMine(0)}
                                disabled={loading || !pendingData.trim()}
                                className="px-4 py-2 rounded text-sm border bg-white text-green-700 border-green-300 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-transparent dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500/10"
                            >{loading ? '⛏️ 挖矿中...' : '⛏️ 挖矿新区块'}</button>
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
                        </div>
                    </div>
                </div>

                {/* 挖矿统计 */}
                {(loading || attempts > 0) && (
                    <div
                        className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                        <div
                            className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <span>挖矿统计 - 区块 #{nextHeight}</span>
                            <div className="flex items-center gap-4">
                                <span>尝试: {attempts.toLocaleString()}</span>
                                <span>耗时: {durationMs.toFixed(1)} ms</span>
                                <span>当前 Nonce: {currentNonce.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 dark:bg-emerald-400 transition-[width] duration-200"
                                style={{width: `${Math.min(100, Math.floor((currentNonce / maxNonce) * 100))}%`}}
                            />
                        </div>
                    </div>
                )}

                {/* 数据输入区 */}
                <div className="mb-6">
                    <XData ref={dataRef as any} onChange={updateData}/>
                </div>

                {/* 区块链展示 */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">区块链</h2>
                    <div className="overflow-x-auto pb-4">
                        <div className="flex items-center gap-6 min-w-max">
                            {blocks.map((block, index) => (
                                <div key={block.height} className="flex items-center">
                                    <div className="flex-shrink-0 w-96">
                                        <BlockCard
                                            block={block}
                                            difficulty={difficulty}
                                            readonly={true}
                                        />
                                    </div>
                                    {index < blocks.length - 1 && (
                                        <div className="flex-shrink-0 mx-4 flex items-center">
                                            <div className="flex items-center">
                                                <div className="w-8 h-0.5 bg-yellow-500 dark:bg-yellow-400"></div>
                                                <div
                                                    className="w-0 h-0 border-l-8 border-l-yellow-500 dark:border-l-yellow-400 border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        💡 提示：水平滚动查看完整区块链
                    </div>
                </div>
            </div>
        </div>
    )
}
