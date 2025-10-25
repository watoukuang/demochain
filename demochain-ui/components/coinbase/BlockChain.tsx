"use client"

import React from 'react'
import BlockCard from './BlockCard'
import type { MiniBlock } from '../../types/block'

type Props = {
  blocks: MiniBlock[]
}

export default function BlockChain({ blocks }: Props) {
  return (
    <div className="blockchain-container w-full">
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {blocks.map((block, index) => (
          <div key={block.height} className="flex items-center">
            <div className="flex-shrink-0 w-80">
              <BlockCard block={block} />
            </div>
            {index < blocks.length - 1 && (
              <div className="flex-shrink-0 mx-3 flex items-center">
                <div className="flex items-center">
                  <div className="w-6 h-0.5 bg-yellow-500 dark:bg-yellow-400"></div>
                  <div className="w-0 h-0 border-l-6 border-l-yellow-500 dark:border-l-yellow-400 border-t-3 border-t-transparent border-b-3 border-b-transparent ml-1"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
