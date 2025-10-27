"use client"

import React, { useState } from 'react'

export default function PosStaking(): React.ReactElement {
  const [balance, setBalance] = useState(1000)
  const [staked, setStaked] = useState(0)
  const [amount, setAmount] = useState(100)

  const stake = () => {
    const amt = Math.max(0, Math.min(balance, Math.floor(amount)))
    setBalance(b => b - amt)
    setStaked(s => s + amt)
  }
  const unstake = () => {
    const amt = Math.max(0, Math.min(staked, Math.floor(amount)))
    setStaked(s => s - amt)
    setBalance(b => b + amt)
  }
  const reset = () => {
    setBalance(1000)
    setStaked(0)
    setAmount(100)
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">POS · 质押池</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">余额: {balance}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">已质押: {staked}</div>
            <div className="ml-auto flex items-center gap-2">
              <input type="number" className="w-24 px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600" value={amount} onChange={e=>setAmount(Number(e.target.value)||0)} />
              <button onClick={stake} className="px-3 py-1.5 rounded border bg-green-500 text-white">质押</button>
              <button onClick={unstake} className="px-3 py-1.5 rounded border bg-yellow-500 text-white">赎回</button>
              <button onClick={reset} className="px-3 py-1.5 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white">重置</button>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-300">演示要点：通过质押数量影响验证者被选中概率。</p>
        </div>
      </div>
    </div>
  )
}
