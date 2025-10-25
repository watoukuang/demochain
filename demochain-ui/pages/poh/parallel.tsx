"use client"

import React, { useState } from 'react'

export default function PohParallel(): React.ReactElement {
  const [q, setQ] = useState<string[]>([])
  const [input, setInput] = useState('tx1')

  const enqueue = () => { if(input.trim()){ setQ(list=>[...list, input.trim()]); setInput('') } }
  const clear = () => setQ([])

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">POH · 并行验证（示意）</h1>
          <div className="flex items-center gap-2 mb-3">
            <input value={input} onChange={e=>setInput(e.target.value)} className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="输入交易"/>
            <button onClick={enqueue} className="px-3 py-1.5 rounded bg-blue-500 text-white">入列</button>
            <button onClick={clear} className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-700 dark:text-white">清空</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border rounded p-3 dark:border-gray-700">
              <div className="text-sm mb-2">序列队列</div>
              <ul className="text-sm space-y-1">
                {q.map((t,i)=> (<li key={i} className="px-2 py-1 rounded bg-gray-50 dark:bg-gray-700">{t}</li>))}
              </ul>
            </div>
            <div className="border rounded p-3 dark:border-gray-700">
              <div className="text-sm mb-2">并行工作线程（示意）</div>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({length:4}).map((_,i)=> (
                  <div key={i} className="h-20 rounded bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-600 dark:text-gray-300">Worker {i+1}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
