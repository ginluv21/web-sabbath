import { useState } from 'react'

function usePageBlocks() {
  const [blocks, setBlocks] = useState([])

  function addBlock(type) {
    const block = {
      id: crypto.randomUUID(),
      type,
      text: type === 'heading' ? 'Добро пожаловать на мой сайт!' : 'Здесь живёт мой текст.',
    }
    setBlocks((current) => [...current, block])
  }

  function updateBlock(id, text) {
    setBlocks((current) => current.map((block) => (
      block.id === id ? { ...block, text } : block
    )))
  }

  function deleteBlock(id) {
    setBlocks((current) => current.filter((block) => block.id !== id))
  }

  return { blocks, addBlock, updateBlock, deleteBlock }
}

export default usePageBlocks
