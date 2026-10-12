import owlMascot from '@/assets/owl-mascot.png'
import BlockToolbar from '@/components/BlockToolbar.jsx'
import PageEditor from '@/components/PageEditor.jsx'
import PagePreview from '@/components/PagePreview.jsx'
import usePageBlocks from '@/hooks/usePageBlocks.js'
import './App.css'

function App() {
  const { blocks, addBlock, updateBlock, deleteBlock } = usePageBlocks()

  return (
    <main className="builder">
      <header className="builder-header">
        <p className="system-label">★ КОНСТРУКТОР ДОМАШНИХ СТРАНИЦ ★</p>
        <div className="brand-row">
          <h1>WEB SABBATH</h1>
          <figure className="mascot-placeholder">
            <figcaption>Питомец в разработке</figcaption>
            <img src={owlMascot} alt="Чёрно-белая сова со скакалкой - маскот Web Sabbath" />
            <p>СОВА НА СКАКАЛКЕ<br />WEB SABBATH PET v0.0</p>
          </figure>
        </div>
        <p className="tagline">СОЗДАЙ САЙТ. ИСПУГАЙ ИНТЕРНЕТ.</p>
        <span className="construction-label">UNDER CONSTRUCTION</span>
      </header>

      <div className="builder-layout">
        <BlockToolbar onAdd={addBlock} />
        <PageEditor blocks={blocks} onUpdate={updateBlock} onDelete={deleteBlock} />
        <PagePreview blocks={blocks} />
      </div>
      <p className="status-bar" role="status">Блоков на странице: {blocks.length}</p>
    </main>
  )
}

export default App
