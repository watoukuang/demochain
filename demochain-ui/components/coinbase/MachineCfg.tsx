"use client"

import { useImperativeHandle, forwardRef, useState } from 'react'
import type { Tx } from '../../types/block'

export type MachineCfgValues = {
  aGpu: '1' | '2' | '3'
  bGpu: '1' | '2' | '3'
  cGpu: '1' | '2' | '3'
  reward: number
  txs: Tx[]
}

export type MachineCfgRef = {
  reset: () => void
}

export type MachineCfgProps = {
  onGpuChange?: (payload: { machine: 'a' | 'b' | 'c'; gpu: '1' | '2' | '3' }) => void
  onTxsChange?: (txs: Tx[]) => void
  onRewardChange?: (reward: number) => void
}

const computers = [
  { value: '1', label: '4核GPU' },
  { value: '2', label: '8核GPU' },
  { value: '3', label: '16核GPU' },
] as const

function MachineCfgInner(props: MachineCfgProps, ref: React.Ref<MachineCfgRef | undefined>) {
  const { onGpuChange, onTxsChange, onRewardChange } = props
  const [aGpu, setAGpu] = useState<'1' | '2' | '3'>('1')
  const [bGpu, setBGpu] = useState<'1' | '2' | '3'>('2')
  const [cGpu, setCGpu] = useState<'1' | '2' | '3'>('3')
  const [reward, setReward] = useState<number>(50)
  const [txs, setTxs] = useState<Tx[]>([])

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Tx>>({})
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useImperativeHandle(ref, () => ({
    reset: () => {
      setAGpu('1'); setBGpu('2'); setCGpu('3'); setReward(50); setTxs([])
      onTxsChange?.([])
      onRewardChange?.(50)
    },
  }), [onTxsChange, onRewardChange])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.fm) errors.fm = 'please input from address!'
    if (!formData.to) errors.to = 'please input to address!'
    if (!formData.amt || isNaN(Number(formData.amt)) || Number(formData.amt) <= 0) errors.amt = 'please input amount!'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const emitGpu = (machine: 'a' | 'b' | 'c', gpu: '1' | '2' | '3') => {
    onGpuChange?.({ machine, gpu })
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
      <div className="pool-cfg-card rounded-lg border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl">
        {/* Card Title */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="title text-lg font-semibold text-yellow-500">配置</h2>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-transparent border border-red-500 text-red-500 rounded hover:bg-red-500/10 transition-colors"
          >
            转账
          </button>
        </div>
        
        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* GPU Configuration Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-white text-sm font-medium">电脑A</label>
              <select
                value={aGpu}
                onChange={(e) => { const v = e.target.value as '1' | '2' | '3'; setAGpu(v); emitGpu('a', v) }}
                className="w-full px-3 py-2 bg-black/20 border border-white/30 text-white rounded focus:outline-none focus:border-blue-400"
              >
                {computers.map((computer) => (
                  <option key={computer.value} value={computer.value} className="bg-gray-800 text-white">
                    {computer.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-white text-sm font-medium">电脑B</label>
              <select
                value={bGpu}
                onChange={(e) => { const v = e.target.value as '1' | '2' | '3'; setBGpu(v); emitGpu('b', v) }}
                className="w-full px-3 py-2 bg-black/20 border border-white/30 text-white rounded focus:outline-none focus:border-blue-400"
              >
                {computers.map((computer) => (
                  <option key={computer.value} value={computer.value} className="bg-gray-800 text-white">
                    {computer.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-white text-sm font-medium">电脑C</label>
              <select
                value={cGpu}
                onChange={(e) => { const v = e.target.value as '1' | '2' | '3'; setCGpu(v); emitGpu('c', v) }}
                className="w-full px-3 py-2 bg-black/20 border border-white/30 text-white rounded focus:outline-none focus:border-blue-400"
              >
                {computers.map((computer) => (
                  <option key={computer.value} value={computer.value} className="bg-gray-800 text-white">
                    {computer.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reward Field */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-white text-sm font-medium">奖励</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={reward}
                  onChange={(e) => { const n = Number(e.target.value) || 0; setReward(n); onRewardChange?.(n) }}
                  className="flex-1 px-3 py-2 bg-black/20 border border-r-0 border-white/30 text-white rounded-l focus:outline-none focus:border-blue-400"
                />
                <span className="px-3 py-2 bg-black/30 border border-white/30 text-white text-sm rounded-r">Bells</span>
              </div>
            </div>
          </div>

          {/* TX Field */}
          <div className="space-y-2">
            <label className="block text-white text-sm font-medium">TX</label>
            <div className="tx">
              {txs && txs.length > 0 ? (
                <div className="border border-white/30 rounded overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-black/30 border-b border-white/30">
                        <th className="px-3 py-2 text-left text-white font-medium">fm</th>
                        <th className="px-3 py-2 text-left text-white font-medium">to</th>
                        <th className="px-3 py-2 text-left text-white font-medium">amt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txs.map((tx: Tx, index: number) => (
                        <tr key={`${tx.fm}-${tx.to}-${tx.amt}-${index}`} className="border-b border-white/20 last:border-b-0">
                          <td className="px-3 py-2 text-white">{tx.fm}</td>
                          <td className="px-3 py-2 text-white">{tx.to}</td>
                          <td className="px-3 py-2 text-white">{tx.amt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="px-3 py-4 bg-black/20 border border-white/30 text-white text-center rounded">
                  暂无转账记录!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg border border-gray-700 w-96 max-w-full mx-4">
            {/* Modal Title */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">开始转账</h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-white text-sm font-medium">fm</label>
                <input
                  type="text"
                  value={formData.fm || ''}
                  onChange={(e) => setFormData({ ...formData, fm: e.target.value })}
                  placeholder="please input from address!"
                  className={`w-full px-3 py-2 bg-black/20 border ${formErrors.fm ? 'border-red-500' : 'border-white/30'} text-white rounded focus:outline-none focus:border-blue-400`}
                />
                {formErrors.fm && <p className="text-red-400 text-xs">{formErrors.fm}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-white text-sm font-medium">to</label>
                <input
                  type="text"
                  value={formData.to || ''}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  placeholder="please input to address!"
                  className={`w-full px-3 py-2 bg-black/20 border ${formErrors.to ? 'border-red-500' : 'border-white/30'} text-white rounded focus:outline-none focus:border-blue-400`}
                />
                {formErrors.to && <p className="text-red-400 text-xs">{formErrors.to}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="block text-white text-sm font-medium">amt</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={formData.amt || ''}
                    onChange={(e) => setFormData({ ...formData, amt: e.target.value })}
                    placeholder="please input amount!"
                    min={0}
                    className={`flex-1 px-3 py-2 bg-black/20 border border-r-0 ${formErrors.amt ? 'border-red-500' : 'border-white/30'} text-white rounded-l focus:outline-none focus:border-blue-400`}
                  />
                  <span className="px-3 py-2 bg-black/30 border border-white/30 text-white text-sm rounded-r">Bells</span>
                </div>
                {formErrors.amt && <p className="text-red-400 text-xs">{formErrors.amt}</p>}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-transparent border border-gray-500 text-gray-300 rounded hover:bg-gray-500/10 transition-colors"
              >
                取消
              </button>
              <button
                onClick={onOk}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default forwardRef(MachineCfgInner)
