"use client"

import React, { forwardRef, useImperativeHandle, useState } from 'react'

export type PoolCfgRef = {
  reset: () => void
}

type Props = {
  onGpuChange?: (config: { machine: 'A' | 'B' | 'C', gpu: '1' | '2' | '3' }) => void
  onDataChange?: (data: string) => void
}

export default forwardRef<PoolCfgRef, Props>(function PoolCfg({ onGpuChange, onDataChange }, ref) {
  const [aGpu, setAGpu] = useState<'1' | '2' | '3'>('1')
  const [bGpu, setBGpu] = useState<'1' | '2' | '3'>('2')
  const [cGpu, setCGpu] = useState<'1' | '2' | '3'>('3')
  const [data, setData] = useState('')

  const reset = () => {
    setAGpu('1')
    setBGpu('2')
    setCGpu('3')
    setData('')
    onDataChange?.('')
  }

  useImperativeHandle(ref, () => ({ reset }), [])

  const handleGpuChange = (machine: 'A' | 'B' | 'C', gpu: '1' | '2' | '3') => {
    if (machine === 'A') setAGpu(gpu)
    if (machine === 'B') setBGpu(gpu)
    if (machine === 'C') setCGpu(gpu)
    onGpuChange?.({ machine, gpu })
  }

  const handleDataChange = (val: string) => {
    setData(val)
    onDataChange?.(val)
  }

  return (
    <div className="pool-cfg h-full rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">矿池配置</h3>
      </div>
      
      <div className="p-4 space-y-4 flex-1">
        {/* GPU配置 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">GPU配置</h4>
          
          {(['A', 'B', 'C'] as const).map((machine) => (
            <div key={machine} className="flex items-center justify-between">
              <label className="text-sm text-gray-600 dark:text-gray-400">电脑{machine}</label>
              <select
                value={machine === 'A' ? aGpu : machine === 'B' ? bGpu : cGpu}
                onChange={(e) => handleGpuChange(machine, e.target.value as '1' | '2' | '3')}
                className="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="1">GPU-1 (慢)</option>
                <option value="2">GPU-2 (中)</option>
                <option value="3">GPU-3 (快)</option>
              </select>
            </div>
          ))}
        </div>

        {/* 数据输入 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">交易数据</label>
          <textarea
            rows={4}
            value={data}
            onChange={(e) => handleDataChange(e.target.value)}
            placeholder="请输入交易数据..."
            className="w-full px-3 py-2 text-sm rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        {/* 重置按钮 */}
        <div className="pt-2">
          <button
            onClick={reset}
            className="w-full px-4 py-2 text-sm rounded border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
          >
            重置配置
          </button>
        </div>
      </div>
    </div>
  )
})
