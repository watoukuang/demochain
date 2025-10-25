"use client"

import React, { useMemo, useState } from 'react'

type Validator = { id: string, stake: number }

export default function PosValidators(): React.ReactElement {
  const [validators, setValidators] = useState<Validator[]>([
    { id: 'V1', stake: 300 },
    { id: 'V2', stake: 500 },
    { id: 'V3', stake: 200 },
  ])
  const total = validators.reduce((s,v)=>s+v.stake,0)
  const [selected, setSelected] = useState<string | null>(null)

  const pick = () => {
    const r = Math.random() * total
    let acc = 0
    for (const v of validators) {
      acc += v.stake
      if (r <= acc) { setSelected(v.id); break }
    }
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">POS · 验证者选择</h1>
          <table className="w-full text-sm border dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-2 text-left">验证者</th>
                <th className="px-3 py-2 text-left">质押</th>
                <th className="px-3 py-2 text-left">权重(%)</th>
              </tr>
            </thead>
            <tbody>
              {validators.map(v=> (
                <tr key={v.id} className="border-t dark:border-gray-700">
                  <td className="px-3 py-2">{v.id}</td>
                  <td className="px-3 py-2">{v.stake}</td>
                  <td className="px-3 py-2">{total? Math.round(v.stake/total*100):0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={pick} className="px-4 py-2 rounded bg-blue-500 text-white">随机选择出块者</button>
            <span className="text-sm text-gray-700 dark:text-gray-300">结果：{selected ?? '未选择'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
