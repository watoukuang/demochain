"use client"

import BlockCardFull from './BlockCardFull'
import type { MiniBlock } from '../../types/block'

export default function BlockChainFull({ blocks }: { blocks: MiniBlock[] }) {
  return (
    <div className="blockchain-container" style={{ width: '100%', display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory' as any }}>
      {blocks.map((b) => (
        <div key={`${b.height}-${b.hash}`} style={{ marginRight: 12, scrollSnapAlign: 'start' }}>
          <BlockCardFull block={b} />
        </div>
      ))}
    </div>
  )
}
