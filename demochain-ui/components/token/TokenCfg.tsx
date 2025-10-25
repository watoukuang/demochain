"use client"

import React, { forwardRef, useImperativeHandle, useState } from 'react'
import type { Tx } from '../../types/block'

export type TokenCfgRef = {
  reset: () => void
}

type Props = {
  onTxsChange?: (txs: Tx[]) => void
}

export default forwardRef<TokenCfgRef, Props>(function TokenCfg({ onTxsChange }, ref) {
  const [txs, setTxs] = useState<Tx[]>([])
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Tx>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const reset = () => {
    setTxs([])
    onTxsChange?.([])
  }

  useImperativeHandle(ref, () => ({ reset }), [txs])

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
      <div className="h-full rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-lg flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">代币转账配置</h3>
            <button
              onClick={() => setOpen(true)}
              className="px-3 py-1.5 text-sm rounded border bg-blue-500 text-white border-blue-500 hover:bg-blue-600 transition-colors"
            >
              添加交易
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 flex-1">
          {/* 交易列表 */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">交易记录</h4>
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
                    {txs.map((tx, idx) => (
                      <tr key={`${tx.fm}-${tx.to}-${tx.amt}-${idx}`} className="border-b border-gray-200 dark:border-gray-600 last:border-b-0">
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

      {/* 添加交易弹窗 */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-96 max-w-full mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">添加交易</h3>
              <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">✕</button>
            </div>
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
                  <span className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-r">Demo</span>
                </div>
                {formErrors.amt && <p className="text-red-500 text-xs">{formErrors.amt}</p>}
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
              <button onClick={onCancel} className="px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">取消</button>
              <button onClick={onOk} className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors">确认</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
})
