"use client"

import React, { useMemo, useState } from 'react'
import * as CryptoJS from 'crypto-js'
import BlockChainFull from '../../components/coinbase/BlockChainFull'
import type { MiniBlock } from '../../types/block'

export default function DposChain(): React.ReactElement {
  const [difficulty, setDifficulty] = useState(2)
  const [producer, setProducer] = useState('A')
  const [blocks, setBlocks] = useState<MiniBlock[]>([{
    height: 1, nonce: 1, data: 'DPoS 创世', previous: '0'.repeat(64), timestamp: Date.now(), hash: '0'.repeat(64), award:'0', miner:'Genesis', txs: []
  }])
  const pattern = useMemo(()=> '0'.repeat(difficulty), [difficulty])
  const last = blocks[blocks.length-1]
  const next = () => {
    const ts = Date.now(); let n=0; let h=''
    while(true){ const i = `${blocks.length+1}${n}${last.hash}${ts}${producer}`; h = CryptoJS.SHA256(i).toString(); if(h.startsWith(pattern)) break; n++ }
    setBlocks(b=>[...b,{height:b.length+1, nonce:n, data:`DPoS ${producer} 出块`, previous:last.hash, timestamp:ts, hash:h, award:'0', miner:producer, txs: []}])
  }
  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">DPoS · 区块链</h1>
          <div className="flex items-center gap-3">
            <label className="text-sm">当前出块者</label>
            <input value={producer} onChange={e=>setProducer(e.target.value)} className="px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"/>
            <label className="text-sm">难度</label>
            <input type="range" min={0} max={5} value={difficulty} onChange={e=>setDifficulty(Number(e.target.value))}/>
            <button onClick={next} className="px-3 py-1.5 rounded bg-blue-500 text-white">产块</button>
          </div>
        </div>
        <BlockChainFull blocks={blocks} />
      </div>
    </div>
  )
}
