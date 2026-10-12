import Button from '@/shared/ui/Button.jsx'

function BlockEditor({ block, onUpdate, onDelete }) {
  const inputId = `block-${block.id}`

  return (
    <article className="block-editor">
      <label htmlFor={inputId}>{block.type === 'heading' ? 'Заголовок' : 'Текст'}</label>
      {block.type === 'heading' ? (
        <input id={inputId} value={block.text} onChange={(event) => onUpdate(block.id, event.target.value)} />
      ) : (
        <textarea id={inputId} rows={4} value={block.text} onChange={(event) => onUpdate(block.id, event.target.value)} />
      )}
      <Button className="delete-button" onClick={() => onDelete(block.id)}>Удалить блок</Button>
    </article>
  )
}

export default BlockEditor
