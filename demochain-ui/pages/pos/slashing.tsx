"use client"

import React, { useState } from 'react'

export default function PosSlashing(): React.ReactElement {
  const [mis, setMis] = useState<{v:string,reason:string}[]>([])
  const [v, setV] = useState('V1')
  const [reason, setReason] = useState('Double-sign')

  const slash = () => {
    setMis(m=>[...m,{v,reason}])
  }
  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">POS · 惩罚机制</h1>
          <div className="flex items-center gap-2 mb-3">
            <input value={v} onChange={e=>setV(e.target.value)} className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="验证者"/>
            <input value={reason} onChange={e=>setReason(e.target.value)} className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="原因"/>
            <button onClick={slash} className="px-3 py-1.5 rounded bg-red-500 text-white">处罚</button>
          </div>
          <ul className="divide-y dark:divide-gray-700">
            {mis.map((m,i)=> (<li key={i} className="px-3 py-2 text-sm">{m.v} - {m.reason}</li>))}
          </ul>
        </div>
      </div>
    </div>
  )
}
