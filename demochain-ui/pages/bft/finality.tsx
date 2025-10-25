"use client"

import React from 'react'

export default function BftFinality(): React.ReactElement {
  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">BFT · 最终性演示</h1>
          <p className="text-sm text-gray-700 dark:text-gray-300">当超过 2/3 的节点进入 Commit 状态时，本区块获得最终性。本页用于解释最终性的达成条件与直观效果（后续可扩展实时模拟）。</p>
        </div>
      </div>
    </div>
  )
}
