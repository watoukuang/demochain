"use client"

import React, { useCallback, useRef, useState } from 'react'
import * as CryptoJS from 'crypto-js'
import PoolCfg, { type PoolCfgRef } from '../components/distribution/PoolCfg'
import Computer from '../components/coinbase/Computer'
import BlockChain from '../components/coinbase/BlockChain'
import type { MiniBlock, ComputerBoard, StepStatus, Tx } from '../types/block'

const maxNonce = 500000

export default function DistributionPage(): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState('')
  const [aGpu, setAGpu] = useState<'1' | '2' | '3'>('1')
  const [bGpu, setBGpu] = useState<'1' | '2' | '3'>('2')
  const [cGpu, setCGpu] = useState<'1' | '2' | '3'>('3')
  const [winner, setWinner] = useState<number | null>(null)
  const [rewardAmount, setRewardAmount] = useState<number>(50)
  const [networkSync, setNetworkSync] = useState<{[key: number]: 'syncing' | 'synced' | 'none'}>({})
  const [confirmations, setConfirmations] = useState<number>(0)
  const [difficulty, setDifficulty] = useState<number>(4)
  const [paused, setPaused] = useState<boolean>(false)
  const winnerRef = useRef<number | null>(null)
  const pausedRef = useRef(false)
  const stopRef = useRef(false)

  const [board, setBoard] = useState<ComputerBoard[]>([
    {
      title: '电脑A',
      steps: [
        { title: '初始化', status: 'wait' },
        { title: '打包交易', status: 'wait' },
        { title: '挖矿计算', status: 'wait' },
        { title: '广播区块', status: 'wait' },
        { title: '同步区块', status: 'wait' }
      ]
    },
    {
      title: '电脑B',
      steps: [
        { title: '初始化', status: 'wait' },
        { title: '打包交易', status: 'wait' },
        { title: '挖矿计算', status: 'wait' },
        { title: '广播区块', status: 'wait' },
        { title: '同步区块', status: 'wait' }
      ]
    },
    {
      title: '电脑C',
      steps: [
        { title: '初始化', status: 'wait' },
        { title: '打包交易', status: 'wait' },
        { title: '挖矿计算', status: 'wait' },
        { title: '广播区块', status: 'wait' },
        { title: '同步区块', status: 'wait' }
      ]
    }
  ])
  
  const [miningProgress, setMiningProgress] = useState<{[key: number]: {nonce: number, progress: number}}>({})

  const [blocks, setBlocks] = useState<MiniBlock[]>([
    {
      height: 1,
      nonce: 49691,
      data: '第一笔交易记录数据',
      previous: '0'.repeat(64),
      timestamp: 1640995200000,
      hash: '0000b61c8bb61a6faa7c46e4872623b6e4caac5a0ae3a3b416849b216d0d62f6',
      award: '50',
      miner: 'Genesis'
    }
  ])

  const cfgRef = useRef<PoolCfgRef>(null)

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  // 简易交易解析：
  // 支持多行，每行格式之一：
  // 1) fm->to:amt  例如: alice->bob:12
  // 2) 仅文本，作为备注展示在 fm 列，例如: xukui
  const parseTxs = (raw: string): Tx[] | undefined => {
    if (!raw.trim()) return undefined
    const lines = raw.split(/\n|\r/).map(s => s.trim()).filter(Boolean)
    const result: Tx[] = []
    for (const line of lines) {
      const m = line.match(/^([^\-]+)->([^:]+):(.+)$/)
      if (m) {
        result.push({ fm: m[1].trim(), to: m[2].trim(), amt: m[3].trim() })
      } else {
        // 无结构文本，作为备注放在 fm 列
        result.push({ fm: line, to: '-', amt: '-' })
      }
    }
    return result.length ? result : undefined
  }

  const resetSteps = () => {
    setBoard(prev => prev.map(b => ({
      title: b.title,
      steps: b.steps.map(s => ({ title: s.title, status: 'wait' as StepStatus }))
    })))
    setMiningProgress({})
    setNetworkSync({})
    setConfirmations(0)
  }

  const setStep = (idx: number, pos: number, status: StepStatus) => {
    setBoard(prev => {
      const next = [...prev]
      next[idx] = {
        ...next[idx],
        steps: next[idx].steps.map((step, i) => 
          i === pos ? { ...step, status } : step
        )
      }
      return next
    })
  }

  const mineTask = async (index: number, gpu: '1' | '2' | '3', targetHeight: number) => {
    try {
      // 步骤 1: 初始化 (快速)
      setStep(index, 0, 'process')
      await sleep(500)
      setStep(index, 0, 'finish')

      // 步骤 2: 打包交易 (中等)
      await sleep(300)
      setStep(index, 1, 'process')
      const lastBlock = blocks[blocks.length - 1]
      const timestamp = Date.now()
      let block: MiniBlock = {
        height: targetHeight,
        nonce: 0,
        data,
        previous: lastBlock.hash,
        timestamp,
        hash: '',
        award: '50',
        miner: `电脑${String.fromCharCode(65 + index)}`
      }
      await sleep(1000)
      setStep(index, 1, 'finish')

      // 步骤 3: 挖矿计算 (主要时间)
      await sleep(500)
      setStep(index, 2, 'process')
      
      // 挖矿计算 - 使用完整的哈希公式
      const gpuSpeed = gpu === '1' ? 1000 : gpu === '2' ? 2000 : 4000 // nonce/秒
      const checkInterval = Math.max(1, Math.floor(gpuSpeed / 10)) // 每100ms检查一次
      
      for (let nonce = 0; nonce < maxNonce; nonce++) {
        // 检查是否已经有获胜者
        if (winnerRef.current !== null) {
          setStep(index, 2, 'error')
          return false
        }
        
        // 更新进度
        if (nonce % checkInterval === 0) {
          setMiningProgress(prev => ({
            ...prev,
            [index]: {
              nonce,
              progress: Math.floor((nonce / maxNonce) * 100)
            }
          }))
          
          // GPU性能延迟
          await sleep(100)
        }
        
        const input = `${block.height}${nonce}${block.previous}${block.timestamp}${block.data}`
        const hash = CryptoJS.SHA256(input).toString()
        const currentPattern = '0'.repeat(difficulty)
        if (hash.startsWith(currentPattern)) {
          block.nonce = nonce
          block.hash = hash
          // 将交易数据解析为 txs 展示
          const txs = parseTxs(data)
          if (txs) {
            block.txs = txs
          }
          
          // 更新最终进度
          setMiningProgress(prev => ({
            ...prev,
            [index]: {
              nonce,
              progress: 100
            }
          }))
          break
        }
      }
      
      setStep(index, 2, 'finish')

      // 步骤 4: 广播区块 (竞争机制)
      await sleep(200)
      setStep(index, 3, 'process')
      
      // 检查是否为第一个完成的
      if (winnerRef.current === null) {
        // 成为获胜者
        winnerRef.current = index
        setWinner(index)
        
        // 设置奖励金额
        block.award = rewardAmount.toString()
        block.miner = `电脑${String.fromCharCode(65 + index)}`
        
        setBlocks(prev => [...prev, block])
        await sleep(800)
        setStep(index, 3, 'finish')
        
        // 步骤 5: 网络同步 - 其他节点接收区块
        await sleep(300)
        setStep(index, 4, 'finish') // 获胜者完成同步
        
        // 启动其他节点的同步过程
        for (let i = 0; i < 3; i++) {
          if (i !== index) {
            setNetworkSync(prev => ({ ...prev, [i]: 'syncing' }))
            setTimeout(() => {
              setStep(i, 4, 'process')
              setTimeout(() => {
                setStep(i, 4, 'finish')
                setNetworkSync(prev => ({ ...prev, [i]: 'synced' }))
              }, 1000 + Math.random() * 1000)
            }, 500 + Math.random() * 500)
          }
        }
        
        // 启动确认过程
        setTimeout(() => {
          let confirmCount = 0
          const confirmInterval = setInterval(() => {
            confirmCount++
            setConfirmations(confirmCount)
            if (confirmCount >= 6) {
              clearInterval(confirmInterval)
            }
          }, 800)
        }, 2000)
        
        return true
      } else {
        // 失败，其他电脑已经获胜 - 停止挖矿并等待同步
        await sleep(500)
        setStep(index, 3, 'error') // 挖矿失败
        setStep(index, 4, 'process') // 等待同步
        return false
      }
    } catch (error) {
      console.error(`电脑${String.fromCharCode(65 + index)}挖矿失败:`, error)
      setStep(index, 2, 'error')
      return false
    }
  }

  const mine = useCallback(async () => {
    if (!data.trim()) {
      alert('请先输入交易数据！')
      return
    }

    setLoading(true)
    setPaused(false)
    pausedRef.current = false
    stopRef.current = false
    setWinner(null)
    winnerRef.current = null
    resetSteps()
    const targetHeight = blocks.length + 1

    try {
      // 并行挖矿，但只有一个能获胜
      const results = await Promise.allSettled([
        mineTask(0, aGpu, targetHeight),
        mineTask(1, bGpu, targetHeight),
        mineTask(2, cGpu, targetHeight),
      ])
      
      const successCount = results.filter(r => r.status === 'fulfilled' && r.value === true).length
      console.log(`挖矿结束，获胜者: 电脑${winnerRef.current !== null ? String.fromCharCode(65 + winnerRef.current) : '无'}, 成功数: ${successCount}`)
    } catch (e) {
      console.error('挖矿过程中出现错误:', e)
    } finally {
      setLoading(false)
    }
  }, [aGpu, bGpu, cGpu, data, blocks, difficulty])

  const reset = () => {
    setBlocks([{
      height: 1,
      nonce: 49691,
      data: '第一笔交易记录数据',
      previous: '0'.repeat(64),
      timestamp: Date.now(),
      hash: '0000b61c8bb61a6faa7c46e4872623b6e5ebcfa4bcb5dc279f56aa96a365e5a',
      award: '50',
      miner: 'Genesis'
    }])
    setWinner(null)
    winnerRef.current = null
    setMiningProgress({})
    setNetworkSync({})
    setConfirmations(0)
    cfgRef.current?.reset()
    resetSteps()
  }

  return (
    <div className="distribution-container px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 控制面板 */}
        <div className="mb-6 p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">分布式挖矿演示</h1>
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
                <span className="w-6 text-right text-sm text-gray-700 dark:text-gray-300">{difficulty}</span>
              </div>
              <button
                onClick={reset}
                disabled={loading}
                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
              >重置链</button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span>当前链长度: {blocks.length} | 下一区块高度: {blocks.length + 1}</span>
              </div>
              {winner !== null && (
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    🏆 电脑{String.fromCharCode(65 + winner)}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    +{rewardAmount} Bells
                  </span>
                  {confirmations > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {confirmations}/6 确认
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={mine}
                disabled={loading || !data.trim()}
                className="px-4 py-2 rounded text-sm border bg-white text-green-700 border-green-300 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-transparent dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500/10"
              >{loading ? '⛏️ 挖矿中...' : '⛏️ 挖矿新区块'}</button>
              <button
                onClick={() => { pausedRef.current = true; setPaused(true); }}
                disabled={!loading || paused}
                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
              >暂停</button>
              <button
                onClick={() => {
                  pausedRef.current = false
                  setPaused(false)
                  // 继续挖矿逻辑需要在 mineTask 中处理
                }}
                disabled={!paused}
                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
              >继续</button>
              <button
                onClick={() => { stopRef.current = true; setPaused(false); }}
                disabled={!loading}
                className="px-3 py-1.5 rounded text-sm border bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 dark:bg-black/20 dark:border-white/20 dark:text-white"
              >停止</button>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <PoolCfg
              ref={cfgRef}
              onGpuChange={({ machine, gpu }) => {
                if (machine === 'A') setAGpu(gpu)
                if (machine === 'B') setBGpu(gpu)
                if (machine === 'C') setCGpu(gpu)
              }}
              onDataChange={(val) => setData(val)}
            />
          </div>
          <div className="lg:col-span-2">
            <Computer items={board} miningProgress={miningProgress} />
          </div>
        </div>

        {/* 公链展示 */}
        <div className="rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-lg">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-red-500 dark:text-red-400">公链</h3>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {['电脑A', '电脑B', '电脑C'].map((label, i) => (
                <div key={i} className="border border-yellow-400 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{label}</span>
                  </div>
                  <BlockChain blocks={blocks} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
