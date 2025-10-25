"use client"

import React, { useState } from 'react'
import * as CryptoJS from 'crypto-js'

export default function PohVdf(): React.ReactElement {
  const [seed, setSeed] = useState('seed')
  const [n, setN] = useState(1000)
  const [out, setOut] = useState('')

  const run = () => {
    let x = seed
    for(let i=0;i<n;i++) x = CryptoJS.SHA256(x).toString()
    setOut(x)
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">POH · VDF 演示（简化）</h1>
          <div className="flex items-center gap-2 mb-3">
            <input value={seed} onChange={e=>setSeed(e.target.value)} className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"/>
            <input type="number" value={n} onChange={e=>setN(Number(e.target.value)||0)} className="w-24 px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"/>
            <button onClick={run} className="px-3 py-1.5 rounded bg-blue-500 text-white">运行</button>
          </div>
          <div className="text-sm break-all text-gray-700 dark:text-gray-300">输出：{out || '（点击运行生成）'}</div>
        </div>
      </div>
    </div>
  )
}
