"use client"

import React, { useState } from 'react'

export default function DposVote(): React.ReactElement {
  const [cands, setCands] = useState<{id:string, votes:number}[]>([
    {id:'A', votes:10}, {id:'B', votes:8}, {id:'C', votes:6}
  ])
  const vote = (id:string) => {
    setCands(cs => cs.map(c => c.id===id? {...c, votes: c.votes+1} : c))
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">DPoS · 投票与权重</h1>
          <ul className="divide-y dark:divide-gray-700">
            {cands.map(c => (
              <li key={c.id} className="px-3 py-2 text-sm flex items-center justify-between">
                <span>{c.id}</span>
                <div className="flex items-center gap-3"><span>{c.votes} 票</span><button onClick={()=>vote(c.id)} className="px-3 py-1 rounded bg-blue-500 text-white">投票</button></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
