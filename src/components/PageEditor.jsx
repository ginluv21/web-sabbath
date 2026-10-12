import BlockEditor from '@/components/BlockEditor.jsx'

function PageEditor({ blocks, onUpdate, onDelete }) {
  return (
    <section className="nes-container is-dark workspace-panel editor-panel" aria-labelledby="editor-title">
      <h2 id="editor-title"><span className="panel-number">02</span> Редактор</h2>
      {blocks.length === 0 ? (
        <p className="empty-message">Пока нет блоков. Добавь заголовок или текст слева.</p>
      ) : blocks.map((block) => (
        <BlockEditor key={block.id} block={block} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </section>
  )
}

export default PageEditor
