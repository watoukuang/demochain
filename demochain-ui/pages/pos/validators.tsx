"use client"

import React, { useState, useEffect } from 'react'
import PermissionGate from '@/components/permissions/PermissionGate'
import { usePermissions } from '@/src/shared/hooks/usePermissions'

type Validator = { id: string, stake: number }

export default function PosValidators(): React.ReactElement {
  const { recordUsage } = usePermissions()
  const [validators, setValidators] = useState<Validator[]>([
    { id: 'V1', stake: 300 },
    { id: 'V2', stake: 500 },
    { id: 'V3', stake: 200 },
  ])
  const total = validators.reduce((s,v)=>s+v.stake,0)
  const [selected, setSelected] = useState<string | null>(null)

  // 记录页面访问
  useEffect(() => {
    recordUsage('consensus_access', { 
      type: 'pos', 
      module: 'validators',
      timestamp: new Date().toISOString()
    })
  }, [recordUsage])

  const pick = async () => {
    const r = Math.random() * total
    let acc = 0
    for (const v of validators) {
      acc += v.stake
      if (r <= acc) { 
        setSelected(v.id)
        // 记录验证者选择操作
        await recordUsage('pos_validator_selection', { 
          selectedValidator: v.id,
          validatorStake: v.stake,
          totalStake: total,
          probability: (v.stake / total * 100).toFixed(2)
        })
        break 
      }
    }
  }

  return (
    <PermissionGate permission="pos_access">
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 页面标题 */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">POS · 验证者选择</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">基于质押权重的概率选择算法演示</p>
          </div>

          {/* 验证者列表 */}
          <div className="p-6 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">验证者</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">质押数量</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">选中权重</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-white">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {validators.map(v => {
                    const percentage = total ? (v.stake / total * 100) : 0
                    const isSelected = selected === v.id
                    return (
                      <tr key={v.id} className={`border-b border-gray-100 dark:border-gray-700 ${isSelected ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                            <span className="font-medium">{v.id}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{v.stake.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-20">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {isSelected ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              已选中
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              待选
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* 操作区域 */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={pick} 
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    🎲 随机选择出块者
                  </button>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    总质押: <span className="font-medium text-gray-900 dark:text-white">{total.toLocaleString()}</span>
                  </div>
                </div>
                {selected && (
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">当前出块者: </span>
                    <span className="font-bold text-green-600 dark:text-green-400">{selected}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 说明信息 */}
          <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">💡 算法说明</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• 验证者被选中的概率与其质押数量成正比</li>
              <li>• 质押越多的验证者，越容易被选为出块者</li>
              <li>• 这种机制激励用户质押更多代币来获得更多奖励</li>
            </ul>
          </div>
        </div>
      </div>
    </PermissionGate>
  )
}
