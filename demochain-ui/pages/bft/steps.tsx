"use client"

import React, { useState } from 'react'

export default function BftSteps(): React.ReactElement {
  const [step, setStep] = useState(0)
  const next = () => setStep(s => Math.min(3, s+1))
  const reset = () => setStep(0)
  const labels = ['提议(Propose)','预投(Prevote)','预提交(Precommit)','提交(Commit)']

  return (
    <div className="px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">BFT · 流程演示</h1>
          <div className="flex items-center gap-3 mb-4">
            {labels.map((l,i)=> (
              <div key={l} className={`px-3 py-2 rounded border text-sm ${i<=step? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-300'}`}>{l}</div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={next} className="px-3 py-1.5 rounded bg-blue-500 text-white">下一步</button>
            <button onClick={reset} className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-700 dark:text-white">重置</button>
          </div>
        </div>
      </div>
    </div>
  )
}
