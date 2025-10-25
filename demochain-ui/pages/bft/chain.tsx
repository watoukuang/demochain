"use client"

import React, { useMemo, useState } from 'react'
import * as CryptoJS from 'crypto-js'
import BlockChainFull from '../../components/coinbase/BlockChainFull'
import type { MiniBlock } from '../../types/block'

export default function BftChain(): React.ReactElement {
  const [difficulty, setDifficulty] = useState(1)
  const [blocks, setBlocks] = useState<MiniBlock[]>([{
    height: 1, nonce: 1, data: 'BFT 创世', previous:'0'.repeat(64), timestamp: Date.now(), hash:'0'.repeat(64), award:'0', miner:'Genesis', txs: []
  }])
  const pattern = useMemo(()=> '0'.repeat(difficulty), [difficulty])
  const last = blocks[blocks.length-1]
  const add = () => {
    const ts = Date.now(); let n=0; let h=''
    while(true){ const i = `${blocks.length+1}${n}${last.hash}${ts}`; h = CryptoJS.SHA256(i).toString(); if(h.startsWith(pattern)) break; n++ }
    setBlocks(b=>[...b,{height:b.length+1, nonce:n, data:'BFT 产块(模拟)', previous:last.hash, timestamp:ts, hash:h, award:'0', miner:'BFT', txs: []}])
  }
  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">BFT · 区块链</h1>
          <div className="flex items-center gap-3">
            <label className="text-sm">难度</label>
            <input type="range" min={0} max={4} value={difficulty} onChange={e=>setDifficulty(Number(e.target.value))}/>
            <button onClick={add} className="px-3 py-1.5 rounded bg-blue-500 text-white">产块</button>
          </div>
        </div>
        <BlockChainFull blocks={blocks} />
      </div>
    </div>
  )
}
