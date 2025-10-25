"use client"

import React, { useState } from 'react'

export default function DposRounds(): React.ReactElement {
  const [producers, setProducers] = useState<string[]>(['A','B','C'])
  const [round, setRound] = useState(1)
  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent(i => (i+1)%producers.length)
    setRound(r => r + (current+1===producers.length ? 1 : 0))
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">DPoS · 出块轮次</h1>
          <div className="mb-3 text-sm text-gray-700 dark:text-gray-300">当前轮次：{round}，当前出块者：{producers[current]}</div>
          <div className="flex items-center gap-2">
            <button onClick={next} className="px-3 py-1.5 rounded bg-blue-500 text-white">下一位出块者</button>
          </div>
        </div>
      </div>
    </div>
  )
}
