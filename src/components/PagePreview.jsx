function PagePreview({ blocks }) {
  return (
    <section className="nes-container is-dark workspace-panel preview-panel" aria-labelledby="preview-title">
      <h2 id="preview-title"><span className="panel-number">03</span> Предпросмотр</h2>
      <div className="page-preview">
        {blocks.length === 0 ? (
          <p className="preview-empty">Здесь появится твоя страница</p>
        ) : blocks.map((block) => (
          block.type === 'heading'
            ? <h3 key={block.id}>{block.text}</h3>
            : <p key={block.id}>{block.text}</p>
        ))}
      </div>
    </section>
  )
}

export default PagePreview
