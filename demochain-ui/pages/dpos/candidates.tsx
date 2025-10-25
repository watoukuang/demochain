"use client"

import React, { useState } from 'react'

export default function DposCandidates(): React.ReactElement {
  const [cands, setCands] = useState<{id:string,votes:number}[]>([
    { id:'A', votes: 10 },
    { id:'B', votes: 8 },
    { id:'C', votes: 6 },
  ])
  const [name, setName] = useState('D')

  const add = () => {
    if (!name.trim()) return
    setCands(c=>[...c,{id:name.trim(), votes:0}])
    setName('')
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">DPoS · 候选人</h1>
          <div className="flex items-center gap-2 mb-3">
            <input value={name} onChange={e=>setName(e.target.value)} className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="候选人ID"/>
            <button onClick={add} className="px-3 py-1.5 rounded bg-blue-500 text-white">新增候选人</button>
          </div>
          <ul className="divide-y dark:divide-gray-700">
            {cands.map(c=> (<li key={c.id} className="px-3 py-2 text-sm flex justify-between"><span>{c.id}</span><span>{c.votes} 票</span></li>))}
          </ul>
        </div>
      </div>
    </div>
  )
}
