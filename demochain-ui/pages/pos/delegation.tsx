"use client"

import React, { useState } from 'react'

export default function PosDelegation(): React.ReactElement {
  const [delegators, setDelegators] = useState<{from:string,to:string,amt:number}[]>([])
  const [from, setFrom] = useState('A')
  const [to, setTo] = useState('V1')
  const [amt, setAmt] = useState(100)

  const add = () => {
    if (!from || !to || amt<=0) return
    setDelegators(d=>[...d,{from,to,amt}])
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">POS · 委托投票</h1>
          <div className="flex items-center gap-2 mb-3">
            <input value={from} onChange={e=>setFrom(e.target.value)} className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="委托人"/>
            <input value={to} onChange={e=>setTo(e.target.value)} className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="验证者"/>
            <input type="number" value={amt} onChange={e=>setAmt(Number(e.target.value)||0)} className="w-24 px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600" placeholder="数量"/>
            <button onClick={add} className="px-3 py-1.5 rounded bg-blue-500 text-white">委托</button>
          </div>
          <div className="border rounded dark:border-gray-700">
            <div className="p-2 text-sm bg-gray-50 dark:bg-gray-700">委托列表</div>
            <ul className="divide-y dark:divide-gray-700">
              {delegators.map((d,i)=> (
                <li key={i} className="px-3 py-2 text-sm">{d.from} {'->'} {d.to} : {d.amt}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
