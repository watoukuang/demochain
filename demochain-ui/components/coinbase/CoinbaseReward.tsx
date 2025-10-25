"use client"

import React, { forwardRef, useImperativeHandle, useState } from 'react'

export type CoinbaseRewardRef = {
  reset: () => void
}

type Props = {
  onRewardChange?: (reward: number) => void
  onMinerChange?: (miner: string) => void
  onCoinChange?: (coin: string) => void
}

// 模拟来源于别人广告的币种
const availableCoins = [
  { symbol: 'Demo', name: 'Demo Chain', advertiser: 'Demo Chain' },
  { symbol: 'BTC', name: 'Bitcoin', advertiser: 'CoinDesk' },
  { symbol: 'ETH', name: 'Ethereum', advertiser: 'Ethereum.org' },
  { symbol: 'BNB', name: 'Binance Coin', advertiser: 'Binance' },
  { symbol: 'ADA', name: 'Cardano', advertiser: 'Cardano Foundation' },
  { symbol: 'SOL', name: 'Solana', advertiser: 'Solana Labs' },
  { symbol: 'DOT', name: 'Polkadot', advertiser: 'Web3 Foundation' },
  { symbol: 'MATIC', name: 'Polygon', advertiser: 'Polygon Technology' },
  { symbol: 'AVAX', name: 'Avalanche', advertiser: 'Ava Labs' },
  { symbol: 'LINK', name: 'Chainlink', advertiser: 'Chainlink Labs' },
  { symbol: 'UNI', name: 'Uniswap', advertiser: 'Uniswap Labs' }
]

export default forwardRef<CoinbaseRewardRef, Props>(function CoinbaseReward({ onRewardChange, onMinerChange, onCoinChange }, ref) {
  const [reward, setReward] = useState<number>(50)
  const [miner, setMiner] = useState<string>('矿工地址')
  const [selectedCoin, setSelectedCoin] = useState<string>('Demo')

  const reset = () => {
    setReward(50)
    setMiner('矿工地址')
    setSelectedCoin('Demo')
    onRewardChange?.(50)
    onMinerChange?.('矿工地址')
    onCoinChange?.('Demo')
  }

  useImperativeHandle(ref, () => ({ reset }), [])

  const handleRewardChange = (val: number) => {
    setReward(val)
    onRewardChange?.(val)
  }

  const handleMinerChange = (val: string) => {
    setMiner(val)
    onMinerChange?.(val)
  }

  const handleCoinChange = (coin: string) => {
    setSelectedCoin(coin)
    onCoinChange?.(coin)
  }

  const selectedCoinInfo = availableCoins.find(c => c.symbol === selectedCoin)

  return (
    <div className="coinbase-reward h-full rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">币基奖励</h3>
      </div>
      
      <div className="p-4 space-y-4 flex-1">
        {/* 币基说明 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">币基交易说明：</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            币基交易是区块中的第一笔交易，由系统自动生成，用于奖励成功挖出区块的矿工。
          </p>
        </div>

        {/* 矿工说明 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">矿工地址</label>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400">矿工地址由获胜的电脑自动决定，请在右侧“矿机配置”中设置各电脑的钱包地址。</p>
          </div>
        </div>

        {/* 奖励金额 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">奖励金额</label>
          <div className="flex items-center">
            <input
              type="number"
              value={reward}
              onChange={(e) => handleRewardChange(Number(e.target.value) || 0)}
              className="flex-1 px-3 py-2 text-sm rounded-l border border-r-0 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <span className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 text-gray-700 rounded-r dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300">{selectedCoin}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">矿工成功挖出区块后获得的币基奖励</p>
        </div>

        {/* 币种（固定为 Demo） */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">币种</label>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">{selectedCoin}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{selectedCoinInfo?.name}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">来源: {selectedCoinInfo?.advertiser}</span>
          </div>
        </div>

        {/* 重置按钮 */}
        <div className="pt-2">
          <button
            onClick={reset}
            className="w-full px-4 py-2 text-sm rounded border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
          >
重置币基配置
          </button>
        </div>
      </div>
    </div>
  )
})
