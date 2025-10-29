"use client"

import React, { forwardRef, useImperativeHandle, useState } from 'react'
import type { Tx } from '../../types/block'

export type CoinbaseCfgRef = {
  reset: () => void
}

type Props = {
  onGpuChange?: (config: { machine: 'A' | 'B' | 'C', gpu: '1' | '2' | '3' }) => void
  onAddressChange?: (config: { machine: 'A' | 'B' | 'C', address: string }) => void
  onTxsChange?: (txs: Tx[]) => void
}

export default forwardRef<CoinbaseCfgRef, Props>(function CoinbaseCfg({ onGpuChange, onAddressChange, onTxsChange }, ref) {
  const [aGpu, setAGpu] = useState<'1' | '2' | '3'>('1')
  const [bGpu, setBGpu] = useState<'1' | '2' | '3'>('2')
  const [cGpu, setCGpu] = useState<'1' | '2' | '3'>('3')
  const [aAddr, setAAddr] = useState<string>('addrA...')
  const [bAddr, setBAddr] = useState<string>('addrB...')
  const [cAddr, setCAddr] = useState<string>('addrC...')
  const [txs, setTxs] = useState<Tx[]>([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Tx>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const reset = () => {
    setAGpu('1')
    setBGpu('2')
    setCGpu('3')
    setAAddr('addrA...')
    setBAddr('addrB...')
    setCAddr('addrC...')
    setTxs([])
    onTxsChange?.([])
  }

  useImperativeHandle(ref, () => ({ reset }), [])

  const handleGpuChange = (machine: 'A' | 'B' | 'C', gpu: '1' | '2' | '3') => {
    if (machine === 'A') setAGpu(gpu)
    if (machine === 'B') setBGpu(gpu)
    if (machine === 'C') setCGpu(gpu)
    onGpuChange?.({ machine, gpu })
  }

  const handleAddrChange = (machine: 'A' | 'B' | 'C', address: string) => {
    if (machine === 'A') setAAddr(address)
    if (machine === 'B') setBAddr(address)
    if (machine === 'C') setCAddr(address)
    onAddressChange?.({ machine, address })
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.fm) errors.fm = '请输入发送地址!'
    if (!formData.to) errors.to = '请输入接收地址!'
    if (!formData.amt || isNaN(Number(formData.amt)) || Number(formData.amt) <= 0) errors.amt = '请输入有效金额!'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const onOk = () => {
    if (validateForm()) {
      const next = [...txs, { fm: String(formData.fm), to: String(formData.to), amt: String(formData.amt) }]
      setTxs(next)
      onTxsChange?.(next)
      setFormData({})
      setFormErrors({})
      setOpen(false)
    }
  }

  const onCancel = () => {
    setOpen(false)
    setFormData({})
    setFormErrors({})
  }

  return (
    <>
      <div className="pool-cfg h-full rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-lg flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">矿机配置</h3>
            <button
              onClick={() => setOpen(true)}
              className="px-3 py-1.5 text-sm rounded border bg-blue-500 text-white border-blue-500 hover:bg-blue-600 transition-colors"
            >
              添加交易
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4 flex-1">
          {/* GPU配置与钱包地址 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">矿机与钱包</h4>
            
            {(['A', 'B', 'C'] as const).map((machine) => (
              <div key={machine} className="flex items-center justify-between">
                <div className="flex items-center gap-2 w-full">
                  <label className="text-sm text-gray-600 dark:text-gray-400 min-w-[52px]">电脑{machine}</label>
                  <select
                    value={machine === 'A' ? aGpu : machine === 'B' ? bGpu : cGpu}
                    onChange={(e) => handleGpuChange(machine, e.target.value as '1' | '2' | '3')}
                    className="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="1">GPU-1 (慢)</option>
                    <option value="2">GPU-2 (中)</option>
                    <option value="3">GPU-3 (快)</option>
                  </select>
                  <input
                    type="text"
                    value={machine === 'A' ? aAddr : machine === 'B' ? bAddr : cAddr}
                    onChange={(e) => handleAddrChange(machine, e.target.value)}
                    placeholder={`电脑${machine} 钱包地址`}
                    className="flex-1 px-3 py-1.5 text-sm rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 交易列表 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">交易记录</h4>
            <div className="tx">
              {txs && txs.length > 0 ? (
                <div className="border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                        <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300 font-medium">发送方</th>
                        <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300 font-medium">接收方</th>
                        <th className="px-3 py-2 text-left text-gray-700 dark:text-gray-300 font-medium">金额</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txs.map((tx: Tx, index: number) => (
                        <tr key={`${tx.fm}-${tx.to}-${tx.amt}-${index}`} className="border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                          <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{tx.fm}</td>
                          <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{tx.to}</td>
                          <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{tx.amt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-3 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 text-center rounded text-sm">
                  暂无交易记录!
                </div>
              )}
            </div>
          </div>

          {/* 重置按钮 */}
          <div className="pt-2">
            <button
              onClick={reset}
              className="w-full px-4 py-2 text-sm rounded border bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 transition-colors dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-500"
            >
              重置矿机配置
            </button>
          </div>
        </div>
      </div>

      {/* 添加交易弹窗 */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-96 max-w-full mx-4">
            {/* Modal Title */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">添加交易</h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 space-y-4">
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">发送方</label>
                <input
                  type="text"
                  value={formData.fm || ''}
                  onChange={(e) => setFormData({ ...formData, fm: e.target.value })}
                  placeholder="请输入发送地址"
                  className={`w-full px-3 py-2 text-sm rounded border ${formErrors.fm ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500`}
                />
                {formErrors.fm && <p className="text-red-500 text-xs">{formErrors.fm}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">接收方</label>
                <input
                  type="text"
                  value={formData.to || ''}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  placeholder="请输入接收地址"
                  className={`w-full px-3 py-2 text-sm rounded border ${formErrors.to ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500`}
                />
                {formErrors.to && <p className="text-red-500 text-xs">{formErrors.to}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">金额</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={formData.amt || ''}
                    onChange={(e) => setFormData({ ...formData, amt: e.target.value })}
                    placeholder="请输入金额"
                    min={0}
                    className={`flex-1 px-3 py-2 text-sm rounded-l border border-r-0 ${formErrors.amt ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500`}
                  />
                  <span className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-r">Bells</span>
                </div>
                {formErrors.amt && <p className="text-red-500 text-xs">{formErrors.amt}</p>}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={onOk}
                className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
})
