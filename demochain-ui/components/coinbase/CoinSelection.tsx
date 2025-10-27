"use client"

import React, { forwardRef, useImperativeHandle, useState } from 'react'

export type CoinSelectionRef = {
  reset: () => void
}

type Props = {
  onCoinChange?: (coin: string) => void
}

// 模拟来源于别人广告的币种
const availableCoins = [
  { symbol: 'BTC', name: 'Bitcoin', advertiser: 'CoinDesk' },
  { symbol: 'ETH', name: 'Ethereum', advertiser: 'Ethereum.org' },
  { symbol: 'BNB', name: 'Binance Coin', advertiser: 'Binance' },
  { symbol: 'ADA', name: 'Cardano', advertiser: 'Cardano Foundation' },
  { symbol: 'SOL', name: 'Solana', advertiser: 'Solana Labs' },
  { symbol: 'DOT', name: 'Polkadot', advertiser: 'Web3 Foundation' },
  { symbol: 'MATIC', name: 'Polygon', advertiser: 'Polygon Technology' },
  { symbol: 'AVAX', name: 'Avalanche', advertiser: 'Ava Labs' },
  { symbol: 'LINK', name: 'Chainlink', advertiser: 'Chainlink Labs' },
  { symbol: 'UNI', name: 'Uniswap', advertiser: 'Uniswap Labs' },
  { symbol: 'Bells', name: 'Demo Bells', advertiser: 'Demo Chain' }
]

export default forwardRef<CoinSelectionRef, Props>(function CoinSelection({ onCoinChange }, ref) {
  const [selectedCoin, setSelectedCoin] = useState<string>('Bells')

  const reset = () => {
    setSelectedCoin('Bells')
    onCoinChange?.('Bells')
  }

  useImperativeHandle(ref, () => ({ reset }), [])

  const handleCoinChange = (coin: string) => {
    setSelectedCoin(coin)
    onCoinChange?.(coin)
  }

  const selectedCoinInfo = availableCoins.find(c => c.symbol === selectedCoin)

  return (
    <div className="coin-selection h-full rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">币种选择</h3>
      </div>
      
      <div className="p-4 space-y-4 flex-1">
        {/* 币种说明 */}
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300 mb-1">币种来源：</p>
          <p className="text-xs text-green-600 dark:text-green-400">
            以下币种信息来源于各大交易所和项目方的广告推广。
          </p>
        </div>

        {/* 当前选择 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">当前币种</label>
          <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">{selectedCoinInfo?.symbol}</span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{selectedCoinInfo?.name}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                by {selectedCoinInfo?.advertiser}
              </span>
            </div>
          </div>
        </div>

        {/* 币种选择 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">选择币种</label>
          <select
            value={selectedCoin}
            onChange={(e) => handleCoinChange(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {availableCoins.map((coin) => (
              <option key={coin.symbol} value={coin.symbol} className="bg-white dark:bg-gray-700">
                {coin.symbol} - {coin.name} (by {coin.advertiser})
              </option>
            ))}
          </select>
        </div>

        {/* 广告信息 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">广告来源</label>
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              📢 {selectedCoinInfo?.advertiser} 推广: {selectedCoinInfo?.name} ({selectedCoinInfo?.symbol})
            </p>
          </div>
        </div>

        {/* 空白填充 */}
        <div className="flex-1"></div>
        
        {/* 重置按钮 */}
        <div className="pt-2">
          <button
            onClick={reset}
            className="w-full px-4 py-2 text-sm rounded border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
          >
            重置币种选择
          </button>
        </div>
      </div>
    </div>
  )
})
