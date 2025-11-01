"use client"

import React from 'react'
import type {MiniBlock, Tx} from '../../types/block'

type Props = {
    block: MiniBlock
}

export default function BlockCard({block}: Props) {
    return (
        <div
            className="block-card-container rounded-lg border bg-white border-gray-200 dark:border-gray-700 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 shadow-lg">
            {/* Card Title */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-yellow-500">区块 {block.height}</h2>
            </div>

            {/* Form Content */}
            <div className="p-4 space-y-4">
                {/* Height Field */}
                <div className="flex items-center">
                    <label className="w-16 text-sm font-medium text-gray-700 dark:text-white">高度</label>
                    <div className="flex-1 flex items-center">
                        <span
                            className="px-2 py-1.5 bg-gray-100 border border-r-0 border-gray-300 text-gray-600 text-sm rounded-l dark:bg-black/30 dark:border-white/30 dark:text-white">#</span>
                        <input
                            type="number"
                            value={block.height}
                            disabled
                            className="flex-1 px-2 py-1.5 text-sm bg-gray-50 border border-gray-300 text-gray-700 rounded-r cursor-not-allowed dark:bg-black/20 dark:border-white/30 dark:text-white"
                        />
                    </div>
                </div>

                {/* Nonce Field */}
                <div className="flex items-center">
                    <label className="w-16 text-sm font-medium text-gray-700 dark:text-white">随机数</label>
                    <div className="flex-1">
                        <input
                            type="number"
                            value={block.nonce}
                            disabled
                            className="w-full px-2 py-1.5 text-sm bg-gray-50 border border-gray-300 text-gray-700 rounded cursor-not-allowed dark:bg-black/20 dark:border-white/30 dark:text-white"
                        />
                    </div>
                </div>

                {/* 交易数据（替换 币基 + TX） */}
                <div className="flex items-start">
                    <label className="w-16 text-sm font-medium pt-2 text-gray-700 dark:text-white">交易数据</label>
                    <div className="flex-1">
            <textarea
                rows={3}
                value={block.data}
                disabled
                className="w-full px-2 py-1.5 text-sm bg-gray-50 border border-gray-300 text-gray-700 rounded cursor-not-allowed resize-none dark:bg-black/20 dark:border-white/30 dark:text-white"
            />
                    </div>
                </div>

                {/* Previous hash Field */}
                <div className="flex items-start">
                    <label className="w-16 text-sm font-medium pt-2 text-gray-700 dark:text-white">前指针</label>
                    <div className="flex-1">
            <textarea
                rows={2}
                value={block.previous}
                disabled
                className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 text-gray-700 rounded font-mono cursor-not-allowed resize-none dark:bg-black/20 dark:border-white/30 dark:text-white"
            />
                    </div>
                </div>

                {/* hash Field */}
                <div className="flex items-start">
                    <label className="w-16 text-sm font-medium pt-2 text-gray-700 dark:text-white">哈希</label>
                    <div className="flex-1">
            <textarea
                rows={2}
                value={block.hash}
                disabled
                className="w-full px-2 py-1.5 text-xs bg-gray-50 border border-gray-300 text-gray-700 rounded font-mono cursor-not-allowed resize-none dark:bg-black/20 dark:border-white/30 dark:text-white"
            />
                    </div>
                </div>
            </div>
        </div>
    )
}
