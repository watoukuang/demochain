"use client"

import React, { useMemo, useState, useEffect } from 'react'
import type { Block } from '../../types/blockchain'

export default function BlockCard({ 
  block, 
  difficulty = 4, 
  readonly = false
}: { 
  block: Block
  difficulty?: number
  readonly?: boolean
}): React.ReactElement {
  const pattern = useMemo(() => '0'.repeat(Math.max(0, Math.min(7, difficulty))), [difficulty])
  const isValid = useMemo(() => block.hash.startsWith(pattern), [block.hash, pattern])
  const [formattedTime, setFormattedTime] = useState<string>('')
  
  useEffect(() => {
    // 客户端格式化时间戳避免水合错误
    setFormattedTime(new Date(block.timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }))
  }, [block.timestamp])
  return (
    <div className="chain-block-card">
      <div className="rounded-xl border bg-white border-gray-200 dark:border-gray-600 dark:bg-gray-800 shadow-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                区块 <span className="text-yellow-600 dark:text-yellow-400">{block.height}</span>
              </h2>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isValid ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30' : 'text-rose-700 bg-rose-100 dark:text-rose-300 dark:bg-rose-900/30'}`}>{isValid ? '有效' : '无效'}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {formattedTime}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">高度</label>
            <div className="flex items-center">
              <span className="inline-flex items-center h-8 px-2 bg-gray-100 border border-r-0 border-gray-300 text-gray-600 text-sm rounded-l dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">#</span>
              <input
                type="number"
                value={block.height}
                disabled={readonly}
                className="flex-1 h-8 px-2 text-sm rounded-r bg-gray-50 border border-gray-300 text-gray-700 cursor-not-allowed dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">随机数</label>
            <input
              type="number"
              value={block.nonce}
              disabled={readonly}
              className="w-full h-8 px-2 text-sm rounded bg-gray-50 border border-gray-300 text-gray-700 cursor-not-allowed dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">时间戳</label>
            <input
              type="text"
              value={formattedTime}
              disabled
              className="w-full h-8 px-2 text-xs bg-gray-50 border border-gray-300 text-gray-700 rounded cursor-not-allowed dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">数据</label>
            <textarea
              rows={3}
              value={block.data}
              disabled={readonly}
              className="w-full px-2 py-1.5 text-sm bg-gray-50 border border-gray-300 text-gray-700 rounded cursor-not-allowed resize-none dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>字符: {block.data.length}</span>
              <span>字节: {new TextEncoder().encode(block.data).length}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">前指针</label>
            <input
              type="text"
              value={block.previous}
              disabled={readonly}
              className="w-full h-8 px-2 text-xs bg-gray-50 border border-gray-300 text-gray-700 rounded font-mono cursor-not-allowed dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">哈希</label>
            <input
              type="text"
              value={block.hash}
              disabled
              className="w-full h-8 px-2 text-xs bg-gray-50 border border-gray-300 text-gray-700 rounded font-mono cursor-not-allowed dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>长度: {block.hash.length}</span>
              <span>目标: {pattern || '无'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
