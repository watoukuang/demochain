"use client"

import React, { useState } from 'react'

export default function BftNodes(): React.ReactElement {
  const [nodes, setNodes] = useState<{id:string, faulty:boolean}[]>([
    {id:'N1', faulty:false},{id:'N2', faulty:false},{id:'N3', faulty:false},{id:'N4', faulty:false},{id:'N5', faulty:false},{id:'N6', faulty:false},{id:'N7', faulty:false}
  ])
  const toggle = (id:string) => setNodes(ns => ns.map(n => n.id===id? {...n, faulty:!n.faulty } : n))
  const faulty = nodes.filter(n=>n.faulty).length

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">BFT · 节点状态</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {nodes.map(n => (
              <button key={n.id} onClick={()=>toggle(n.id)} className={`px-3 py-2 rounded border text-sm ${n.faulty? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>{n.id} {n.faulty? '故障' : '正常'}</button>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-700 dark:text-gray-300">故障节点：{faulty} / {nodes.length}（{'>'} n/3 将无法达成共识）</div>
        </div>
      </div>
    </div>
  )
}
