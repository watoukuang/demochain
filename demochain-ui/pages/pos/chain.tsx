"use client"

import React, { useMemo, useState } from 'react'
import * as CryptoJS from 'crypto-js'
import BlockChainFull from '../../components/coinbase/BlockChainFull'
import type { MiniBlock } from '../../types/block'

export default function PosChain(): React.ReactElement {
  const [difficulty, setDifficulty] = useState(2)
  const [blocks, setBlocks] = useState<MiniBlock[]>([{
    height: 1,
    nonce: 1,
    data: 'POS 创世',
    previous: '0'.repeat(64),
    timestamp: Date.now(),
    hash: '0'.repeat(64),
    award: '0',
    miner: 'Genesis',
    txs: []
  }])
  const pattern = useMemo(()=> '0'.repeat(difficulty), [difficulty])
  const last = blocks[blocks.length-1]
  const nextHeight = blocks.length+1

  const add = () => {
    const ts = Date.now()
    let nonce = 0, h = ''
    while(true){
      const input = `${nextHeight}${nonce}${last.hash}${ts}`
      h = CryptoJS.SHA256(input).toString()
      if (h.startsWith(pattern)) break
      nonce++
    }
    setBlocks(b=> [...b, { height: nextHeight, nonce, data:'POS 出块', previous: last.hash, timestamp: ts, hash: h, award:'0', miner:'Validator', txs: [] }])
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="p-4 rounded-lg border bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">POS · 区块链</h1>
          <div className="flex items-center gap-3">
            <label className="text-sm">难度</label>
            <input type="range" min={0} max={5} value={difficulty} onChange={e=>setDifficulty(Number(e.target.value))}/>
            <button onClick={add} className="px-3 py-1.5 rounded bg-blue-500 text-white">产块</button>
          </div>
        </div>
        <BlockChainFull blocks={blocks} />
      </div>
    </div>
  )
}
