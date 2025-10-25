"use client"

import React from 'react'
import type { ComputerBoard, StepStatus } from '../../types/block'

type Props = {
  items: ComputerBoard[]
  miningProgress?: {[key: number]: {nonce: number, progress: number}}
}

const getStatusColor = (status: StepStatus) => {
  switch (status) {
    case 'wait':
      return 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
    case 'process':
      return 'bg-blue-500 text-white animate-pulse'
    case 'finish':
      return 'bg-green-500 text-white'
    case 'error':
      return 'bg-red-500 text-white'
    default:
      return 'bg-gray-300 text-gray-600'
  }
}

const getStatusIcon = (status: StepStatus) => {
  switch (status) {
    case 'wait':
      return '⏳'
    case 'process':
      return '⚡'
    case 'finish':
      return '✅'
    case 'error':
      return '❌'
    default:
      return '⏳'
  }
}

export default function Computer({ items, miningProgress = {} }: Props) {
  return (
    <div className="computer-panel h-full rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-lg flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">挖矿进度</h3>
      </div>
      
      <div className="p-4 space-y-4 flex-1">
        {items.map((computer, index) => {
          const progress = miningProgress[index]
          const isMining = computer.steps[2]?.status === 'process' // 挖矿计算步骤
          
          return (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{computer.title}</h4>
                {progress && isMining && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Nonce: {progress.nonce.toLocaleString()} ({progress.progress}%)
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {computer.steps.map((step, stepIndex) => (
                  <React.Fragment key={stepIndex}>
                    <div className="flex flex-col items-center space-y-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${getStatusColor(step.status)}`}>
                        {getStatusIcon(step.status)}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{step.title}</span>
                    </div>
                    
                    {stepIndex < computer.steps.length - 1 && (
                      <div className="flex-1 h-0.5 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              {/* 挖矿进度条 */}
              {progress && isMining && (
                <div className="mt-2">
                  <div className="h-1.5 w-full rounded bg-gray-200 dark:bg-gray-600 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 dark:bg-blue-400 transition-[width] duration-200"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
