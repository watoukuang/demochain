"use client"

import React, { useCallback, useEffect, useState } from 'react'
import * as CryptoJS from 'crypto-js'

const difficulty = 4
const pattern = '0'.repeat(difficulty)
const maxNonce = 500000

export default function Block(): React.ReactElement {
  const [height, setHeight] = useState<number>(1)
  const [nonce, setNonce] = useState<number>(72608)
  const [data, setData] = useState<string>('')
  const [hash, setHash] = useState<string>('0000f727854b50bb95c054b39c1fe5c92e5ebcfa4bcb5dc279f56aa96a365e5a')
  const [loading, setLoading] = useState<boolean>(false)

  const computeHash = useCallback((h: number, n: number, d: string) => {
    const str = `${h}${n}${d}`
    return CryptoJS.SHA256(str).toString()
  }, [])

  useEffect(() => {
    setHash(computeHash(height, nonce, data))
  }, [height, nonce, data, computeHash])

  const mine = useCallback(async () => {
    setLoading(true)
    // 先让出一次主线程渲染按钮状态
    await new Promise((r) => setTimeout(r, 200))
    const localHeight = height
    const localData = data
    let foundHash = ''

    for (let i = 0; i <= maxNonce; i++) {
      const input = `${localHeight}${i}${localData}`
      const h = CryptoJS.SHA256(input).toString()
      if (h.substring(0, difficulty) === pattern) {
        setNonce(i)
        foundHash = h
        break
      }
      // 定期让出主线程，避免页面掉帧
      if (i % 5000 === 0) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 0))
      }
    }

    if (foundHash) setHash(foundHash)
    setLoading(false)
  }, [height, data])

  return (
    <div className="block-page px-4 py-8">
      <div className="contain max-w-4xl mx-auto">
        <div className="r-card rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 shadow-xl">
          {/* Card Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="block-title text-xl font-semibold text-gray-900 dark:text-yellow-500">区块</h2>
            <button
              onClick={mine}
              disabled={loading}
              className="green-btn px-4 py-2 rounded text-sm border bg-white text-green-700 border-green-300 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-transparent dark:border-green-500 dark:text-green-500 dark:hover:bg-green-500/10"
            >
              {loading ? '⛏️ 挖矿中...' : '⛏️ 挖矿'}
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Height Field */}
            <div className="flex items-center">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-white">高度</label>
              <div className="flex-1 flex items-center">
                <span className="px-3 py-2 bg-gray-50 border border-r-0 border-gray-300 text-gray-700 text-sm rounded-l dark:bg-black/30 dark:border-white/30 dark:text-white">#</span>
                <input
                  type="number"
                  value={height}
                  min={1}
                  onChange={(e) => setHeight(Number(e.target.value) || 1)}
                  className="flex-1 px-3 py-2 rounded-r bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-black/20 dark:border-white/30 dark:text-white"
                />
              </div>
            </div>

            {/* Nonce Field */}
            <div className="flex items-center">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-white">随机数</label>
              <div className="flex-1">
                <input
                  type="number"
                  value={nonce}
                  min={1}
                  max={maxNonce}
                  onChange={(e) => setNonce(Number(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-black/20 dark:border-white/30 dark:text-white"
                />
              </div>
            </div>

            {/* Data Field */}
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

            {/* Hash Field */}
            <div className="flex items-center">
              <label className="w-20 text-sm font-medium text-gray-700 dark:text-white">哈希</label>
              <div className="flex-1">
                <input
                  type="text"
                  value={hash}
                  disabled
                  className="w-full px-3 py-2 rounded text-xs font-mono cursor-not-allowed opacity-75 bg-white border border-gray-300 text-gray-900 dark:bg-black/20 dark:border-white/30 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
