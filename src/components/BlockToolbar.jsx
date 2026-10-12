import Button from '@/shared/ui/Button.jsx'

function BlockToolbar({ onAdd }) {
  return (
    <section className="nes-container is-dark workspace-panel elements-panel" aria-labelledby="elements-title">
      <h2 id="elements-title"><span className="panel-number">01</span> Элементы</h2>
      <p className="panel-note">Добавь блок в свою страницу</p>
      <div className="toolbar-buttons">
        <Button onClick={() => onAdd('heading')}>+ Заголовок</Button>
        <Button onClick={() => onAdd('text')}>+ Текст</Button>
      </div>
    </section>
  )
}

export default BlockToolbar
