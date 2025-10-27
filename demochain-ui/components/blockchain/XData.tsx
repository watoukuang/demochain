"use client"

import React, { forwardRef, useImperativeHandle, useState } from 'react'

export type XDataRef = { reset: () => void }

export default forwardRef(function XData(
  { onChange }: { onChange?: (val: string) => void },
  ref: React.Ref<XDataRef | undefined>
) {
  const [data, setData] = useState('')

  const change = (val: string) => {
    setData(val)
    onChange?.(val)
  }

  const reset = () => {
    setData('')
    onChange?.('')
  }

  useImperativeHandle(ref, () => ({ reset }), [])

  return (
    <div className="chain-r-card rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 shadow-xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="card-title text-lg font-semibold text-gray-900 dark:text-yellow-500">数据</h2>
        <button
          onClick={reset}
          className="yellow-btn px-4 py-2 rounded text-sm border bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50 transition-colors dark:bg-transparent dark:border-yellow-500 dark:text-yellow-500 dark:hover:bg-yellow-500/10"
        >
          重置
        </button>
      </div>
      
      <div className="p-6">
        <textarea
          rows={8}
          value={data}
          onChange={(e) => change(e.target.value)}
          placeholder="请输入数据!"
          className="text-area w-full px-3 py-2 rounded resize-none bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-black/20 dark:border-white/30 dark:text-white"
        />
      </div>
    </div>
  )
})
