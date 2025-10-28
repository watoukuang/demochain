"use client"

import type { MiniBlock, Tx } from '../../types/block'

export default function BlockCardFull({ block }: { block: MiniBlock }) {
  return (
    <div className="cbase block-card-container rounded-lg border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl w-[420px] shrink-0">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-yellow-500">区块</h2>
      </div>
      
      {/* Form Content */}
      <div className="p-6 space-y-6">
        {/* Height Field */}
        <div className="flex items-center">
          <label className="w-16 text-white text-sm font-medium">高度</label>
          <div className="flex-1 flex items-center">
            <span className="px-3 bg-black/30 border border-r-0 border-white/30 text-white text-sm rounded-l h-10 flex items-center">#</span>
            <input
              type="number"
              value={block.height}
              min={1}
              disabled
              className="flex-1 px-3 bg-black/20 border border-white/30 text-white rounded-r cursor-not-allowed opacity-75 h-10"
            />
          </div>
        </div>

        {/* Nonce Field */}
        <div className="flex items-center">
          <label className="w-16 text-white text-sm font-medium">随机数</label>
          <div className="flex-1">
            <input
              type="number"
              value={block.nonce}
              min={1}
              max={500000}
              disabled
              className="w-full px-3 py-2 bg-black/20 border border-white/30 text-white rounded cursor-not-allowed opacity-75"
            />
          </div>
        </div>

        {/* Coinbase Field */}
        {block.award && block.miner && (
          <div className="flex items-center overflow-hidden">
            <label className="w-16 text-white text-sm font-medium">币基</label>
            <div className="flex-1 flex items-center space-x-2 overflow-hidden">
              <div className="flex items-center flex-1 min-w-0">
                <span className="px-3 py-2 bg-black/30 border border-r-0 border-white/30 text-white text-sm rounded-l h-10 flex items-center">Bells</span>
                <input
                  type="text"
                  value={block.award}
                  disabled
                  className="w-0 flex-1 min-w-0 px-3 py-2 bg-black/20 border border-white/30 text-white rounded-r cursor-not-allowed opacity-75 h-10"
                />
              </div>
              <input
                type="text"
                value=">"
                disabled
                className="flex-none w-12 px-2 py-2 bg-black/20 border border-white/30 text-white rounded text-center cursor-not-allowed opacity-75 h-10"
              />
              <input
                type="text"
                value={block.miner}
                disabled
                className="w-0 flex-1 min-w-0 px-3 py-2 bg-black/20 border border-white/30 text-white rounded cursor-not-allowed opacity-75 h-10"
              />
            </div>
          </div>
        )}

        {/* TX Field */}
        <div className="flex items-start">
          <label className="w-16 text-white text-sm font-medium pt-2">TX</label>
          <div className="flex-1">
            {block.txs && block.txs.length > 0 ? (
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
                    {block.txs.map((tx: Tx, index: number) => (
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

        {/* Previous hash Field */}
        <div className="flex items-start">
          <label className="w-16 text-white text-sm font-medium pt-2">前指针</label>
          <div className="flex-1">
            <textarea
              rows={2}
              value={block.previous}
              disabled
              className="w-full px-3 py-2 bg-black/20 border border-white/30 text-white rounded text-xs font-mono cursor-not-allowed opacity-75 resize-none"
            />
          </div>
        </div>

        {/* hash Field */}
        <div className="flex items-start">
          <label className="w-16 text-white text-sm font-medium pt-2">哈希</label>
          <div className="flex-1">
            <textarea
              rows={2}
              value={block.hash}
              disabled
              className="w-full px-3 py-2 bg-black/20 border border-white/30 text-white rounded text-xs font-mono cursor-not-allowed opacity-75 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
