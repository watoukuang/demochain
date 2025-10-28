"use client"

import React, {useState, useEffect} from 'react'
import PermissionGate from '@/components/permission/PermissionGate'
import {usePerms} from '@/src/shared/hooks/usePerms'

export default function PosStaking(): React.ReactElement {
    const {recordUsage} = usePerms()
    const [balance, setBalance] = useState(1000)
    const [staked, setStaked] = useState(0)
    const [amount, setAmount] = useState(100)

    // 记录页面访问
    useEffect(() => {
        recordUsage('consensus_access', {
            type: 'pos',
            module: 'staking',
            timestamp: new Date().toISOString()
        })
    }, [recordUsage])

    const stake = async () => {
        const amt = Math.max(0, Math.min(balance, Math.floor(amount)))
        setBalance(b => b - amt)
        setStaked(s => s + amt)

        // 记录质押操作
        await recordUsage('pos_staking', {
            action: 'stake',
            amount: amt,
            newBalance: balance - amt,
            newStaked: staked + amt
        })
    }

    const unstake = async () => {
        const amt = Math.max(0, Math.min(staked, Math.floor(amount)))
        setStaked(s => s - amt)
        setBalance(b => b + amt)

        // 记录赎回操作
        await recordUsage('pos_staking', {
            action: 'unstake',
            amount: amt,
            newBalance: balance + amt,
            newStaked: staked - amt
        })
    }

    const reset = async () => {
        setBalance(1000)
        setStaked(0)
        setAmount(100)

        // 记录重置操作
        await recordUsage('pos_staking', {
            action: 'reset'
        })
    }

    return (
        <PermissionGate permission="pos_access">
            <div className="px-4 py-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* 页面标题和权限提示 */}
                    <div
                        className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">POS ·
                                    质押池</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">权益证明共识机制演示 -
                                    付费功能</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-600 dark:text-green-400 font-medium">已解锁</span>
                            </div>
                        </div>
                    </div>

                    {/* 质押操作面板 */}
                    <div
                        className="p-6 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
                        <div className="flex items-center gap-6 mb-4">
                            <div className="flex-1">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">可用余额</div>
                                <div
                                    className="text-2xl font-bold text-gray-900 dark:text-white">{balance.toLocaleString()}</div>
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">已质押</div>
                                <div
                                    className="text-2xl font-bold text-green-600 dark:text-green-400">{staked.toLocaleString()}</div>
                            </div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">总资产</div>
                                <div
                                    className="text-2xl font-bold text-blue-600 dark:text-blue-400">{(balance + staked).toLocaleString()}</div>
                            </div>
                        </div>

                        {/* 操作区域 */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        操作数量
                                    </label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={amount}
                                        onChange={e => setAmount(Number(e.target.value) || 0)}
                                        min="0"
                                        max={Math.max(balance, staked)}
                                    />
                                </div>
                                <div className="flex gap-2 pt-6">
                                    <button
                                        onClick={stake}
                                        disabled={balance < amount || amount <= 0}
                                        className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                    >
                                        质押
                                    </button>
                                    <button
                                        onClick={unstake}
                                        disabled={staked < amount || amount <= 0}
                                        className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                    >
                                        赎回
                                    </button>
                                    <button
                                        onClick={reset}
                                        className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors font-medium"
                                    >
                                        重置
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 说明信息 */}
                    <div
                        className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">💡 演示要点</h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                            <li>• 通过质押代币获得验证权益，质押越多被选中概率越高</li>
                            <li>• 质押的代币会被锁定，但可以获得区块奖励</li>
                            <li>• 赎回操作通常有等待期，防止恶意行为</li>
                        </ul>
                    </div>

                    {/* 质押比例可视化 */}
                    <div
                        className="p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">质押比例</h3>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                            <div
                                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                                style={{width: `${balance + staked > 0 ? (staked / (balance + staked)) * 100 : 0}%`}}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                            <span>未质押: {((balance / (balance + staked)) * 100 || 0).toFixed(1)}%</span>
                            <span>已质押: {((staked / (balance + staked)) * 100 || 0).toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </PermissionGate>
    )
}
