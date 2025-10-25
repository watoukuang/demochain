"use client"

import React, { useEffect, useRef, useState } from 'react'

export default function PohTimeline(): React.ReactElement {
  const [running, setRunning] = useState(false)
  const [items, setItems] = useState<{i:number, ts:number}[]>([])
  const ref = useRef<NodeJS.Timeout | null>(null)

  useEffect(()=>{
    if(running){
      ref.current = setInterval(()=>{
        setItems(list => [...list, { i: list.length+1, ts: Date.now() }])
      }, 500)
    } else if(ref.current){ clearInterval(ref.current); ref.current = null }
    return ()=>{ if(ref.current) clearInterval(ref.current) }
  }, [running])

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">POH · 时序证明</h1>
          <div className="flex items-center gap-2 mb-3">
            <button onClick={()=>setRunning(v=>!v)} className="px-3 py-1.5 rounded bg-blue-500 text-white">{running? '停止' : '开始'}</button>
            <button onClick={()=>setItems([])} className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-700 dark:text-white">清空</button>
          </div>
          <ul className="divide-y dark:divide-gray-700">
            {items.slice(-20).map(it => (
              <li key={it.i} className="px-3 py-2 text-sm">#{it.i} - {new Date(it.ts).toLocaleTimeString()}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
