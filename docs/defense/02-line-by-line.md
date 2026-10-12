# Web Sabbath: построчный разбор текущего проекта

## Как читать

Это снимок исходников на 12 октября 2026 года после реализации лабы 4. Для каждого текстового файла ниже сначала приведён весь код без изменений, затем объяснена буквально каждая строка, включая пустые строки и закрывающие скобки, затем разобрано действие компонента/файла целиком. Номера соответствуют текущему файлу. После будущих правок их нужно сверять заново.

Исходники приложения, CSS и конфигурации разбираются полностью. Ты не обязан объяснять каждую строку скачанных React/Vite/NES.css и автоматически созданного lock-файла: это чужие пакеты и машинная запись. Их назначение всё равно перечислено. Текст документации читается как документ, не исполняется как программа.

## Что за проект и чем его запускать

React - библиотека интерфейса. Vite - инструмент разработки/сборки, буква V не обозначает хостинг. index.html запускает main.jsx, тот показывает App, App вызывает хук и передаёт props компонентам. npm install ставит зависимости; npm run dev запускает локальный сервер. Исходники лежат на компьютере, GitHub хранит коммиты. Подробная теория и вопросы - в [гайде 01](01-theory-and-questions.md).

## Карта всех папок и файлов

| Путь | Кто создал / изменил | Назначение |
| --- | --- | --- |
| .git/ | Git при clone | История, ветки, remote. Внутренние файлы вручную не редактируем |
| node_modules/ | npm install | Скачанные зависимости, включая зависимости зависимостей; в Git не добавляем |
| dist/ | vite build | HTML/CSS/JS и картинка для браузера, в Git не добавляем |
| index.html | Шаблон Vite, изменён нами | Язык, заголовок вкладки, root и загрузка main.jsx |
| src/main.jsx | Шаблон Vite + наш импорт NES.css | Вход React в DOM |
| src/App.jsx | Полностью переписан нами | Общий родитель и шапка |
| src/App.css | Полностью переписан нами | Компоновка и оформление приложения |
| src/index.css | Полностью переписан нами | Общий шрифт, фон, box-sizing |
| src/components/BlockToolbar.jsx | Создан нами | Кнопки добавления |
| src/components/BlockEditor.jsx | Создан нами | Изменение и удаление одного блока |
| src/components/PageEditor.jsx | Создан нами | Список редакторов блоков |
| src/components/PagePreview.jsx | Создан нами | Предпросмотр из того же массива |
| src/hooks/usePageBlocks.js | Создан нами | useState и операции над блоками |
| src/shared/ui/Button.jsx | Создан нами; класс NES.css готовый | Общая кнопка |
| src/assets/owl-mascot.png | Обработан imagegen из присланного изображения | Статичная картинка с прозрачностью; не программа |
| src/data/services.js | Пустой файл на момент проверки | Остаток старой темы, не импортируется. Ноль строк, разбирать нечего |
| vite.config.js | Шаблон Vite + наша настройка @ | Реальное разрешение импортов и React-плагин |
| jsconfig.json | Создан нами | Подсказки редактора для @, не TypeScript-приложение |
| package.json | Шаблон + изменение имени + npm install nes.css | Команды и прямые зависимости |
| package-lock.json | npm | Зафиксированные версии, дерево пакетов, integrity. Не написан построчно вручную |
| .oxlintrc.json | Шаблон Vite | Правила oxlint |
| .gitignore | Шаблон Vite | Исключает зависимости/сборку/логи |
| README.md | Написан и обновлён нами | Идея, roadmap, источники, запуск и критерии |
| THIRD_PARTY_NOTICES.md | Добавлен нами, текст лицензии сторонний | Сохранённое авторство и MIT-текст NES.css |
| docs/defense/01-theory-and-questions.md | Написан для защиты | Теория и симуляция вопросов |
| docs/defense/02-line-by-line.md | Этот документ | Разбор строк |
| docs/defense/03-defense-playbook.md | Написан для защиты | Порядок демонстрации и выступления |

Цвет U в редакторе значит untracked, а не ошибку. M означает изменённый отслеживаемый файл. Цифры диагностики редактора читают в Problems: нельзя определить их причину только по скриншоту.

## Маршрут данных

```text
index.html -> main.jsx -> App
                          |
                          usePageBlocks: blocks
                          |
            +-------------+---------------+
            |             |               |
       BlockToolbar   PageEditor      PagePreview
       onAdd          BlockEditor     только читает
                      onUpdate/onDelete
```

Callback возвращает событие к функциям хука; данные после обновления снова идут сверху вниз. Счётчик берёт blocks.length из того же состояния.


## index.html

Происхождение: Vite создал основу; мы изменили язык, название и убрали favicon шаблона.

### Весь файл

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web Sabbath - конструктор страниц</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `<!doctype html>` | Объявляет HTML5. Это служебная инструкция браузеру, не видимый элемент. |
| 2 | `<html lang="ru">` | Открывает корневой HTML-элемент. lang="ru" сообщает основной язык страницы браузеру и средствам доступности. |
| 3 | `<head>` | Начинает head: метаданные и настройки, не содержимое редактора. |
| 4 | `<meta charset="UTF-8" />` | UTF-8 позволяет корректно показывать русский текст, символы и подписи. |
| 5 | `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` | Ширина области просмотра равна ширине устройства. Без этого мобильный браузер может отображать уменьшенную настольную страницу. |
| 6 | `<title>Web Sabbath - конструктор страниц</title>` | Текст вкладки браузера. Не меняет URL: localhost задаётся адресом сервера. |
| 7 | `</head>` | Закрывает область метаданных. |
| 8 | `<body>` | Открывает тело страницы, где будет интерфейс. |
| 9 | `<div id="root"></div>` | Пустой контейнер root. React DOM позже помещает сюда App; сам по себе он не содержит конструктора. |
| 10 | `<script type="module" src="/src/main.jsx"></script>` | Загружает main.jsx как JavaScript-модуль. Vite обрабатывает этот путь и зависимости при разработке/сборке. |
| 11 | `</body>` | Закрывает тело документа. |
| 12 | `</html>` | Закрывает HTML-документ. |

### Файл целиком: что происходит

Браузер получает минимальную HTML-страницу, знает язык/кодировку/viewport и запускает модуль main.jsx. Разметка блоков пользователя здесь не хранится.

## src/main.jsx

Происхождение: Vite создал точку входа; мы добавили импорт NES.css. Остальной механизм запуска остался шаблонным.

### Весь файл

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'nes.css/css/nes.min.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `import { StrictMode } from 'react'` | Именованный импорт StrictMode из React. Это обёртка с дополнительными проверками разработки. |
| 2 | `import { createRoot } from 'react-dom/client'` | Импорт createRoot из React DOM: нужен для подключения компонентов к реальному DOM браузера. |
| 3 | `import 'nes.css/css/nes.min.css'` | Подключает готовый CSS NES.css из установленного пакета. Это действительно заимствованные стили, не написанные нами. |
| 4 | `import './index.css'` | Подключает общие собственные стили после библиотечных. Свои правила могут переопределять библиотеку с учётом специфичности. |
| 5 | `import App from './App.jsx'` | Импортирует основной компонент App. Относительный путь начинается от папки src. |
| 6 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 7 | `createRoot(document.getElementById('root')).render(` | Находит div с id root из index.html, создаёт React-root и начинает вызов render. document - объект документа браузера. |
| 8 | `<StrictMode>` | Открывает StrictMode. В разработке React проверяет корректность поведения; дополнительных DOM-обёрток этот компонент не рисует. |
| 9 | `<App />` | Просит React отрисовать компонент App внутри root. |
| 10 | `</StrictMode>,` | Закрывает StrictMode; запятая после JSX - допустимая завершающая запятая аргументов вызова. |
| 11 | `)` | Закрывает render. Это точка запуска приложения, не обработчик кнопки. |

### Файл целиком: что происходит

Соединяет HTML-root и React. Порядок импортов CSS обеспечивает основу библиотеки и наше оформление. Здесь не должно быть состояния страницы и запросов API.

## src/App.jsx

Происхождение: Файл появился из Vite, но текущий компонент целиком переписан для Web Sabbath.

### Весь файл

```jsx
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
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `import owlMascot from '@/assets/owl-mascot.png'` | Импорт PNG через алиас @. Vite превращает импорт в URL ресурса и включает картинку в сборку. |
| 2 | `import BlockToolbar from '@/components/BlockToolbar.jsx'` | Импорт панели добавления. Большое имя будет использовано как JSX-компонент. |
| 3 | `import PageEditor from '@/components/PageEditor.jsx'` | Импорт списка полей редактора. |
| 4 | `import PagePreview from '@/components/PagePreview.jsx'` | Импорт предпросмотра страницы. |
| 5 | `import usePageBlocks from '@/hooks/usePageBlocks.js'` | Импорт собственного хука. Здесь только ссылка на функцию, вызов ниже. |
| 6 | `import './App.css'` | Подключение CSS компоновки, рамок и кнопок приложения. |
| 7 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 8 | `function App() {` | Объявляет основной компонент App. React вызывает эту функцию для вычисления интерфейса. |
| 9 | `const { blocks, addBlock, updateBlock, deleteBlock } = usePageBlocks()` | Вызывает usePageBlocks на верхнем уровне и деструктурирует возвращённый объект. blocks - данные; остальные три свойства - callbacks. Этот единственный вызов делает App общим владельцем состояния. |
| 10 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 11 | `return (` | Начинает возврат JSX. Всё ниже описывает интерфейс текущей отрисовки. |
| 12 | `<main className="builder">` | Открывает основную область main. className связывает элемент с CSS-селектором .builder. |
| 13 | `<header className="builder-header">` | Открывает шапку сайта. Здесь оформление и маскот, не состояние редактора. |
| 14 | `<p className="system-label">★ КОНСТРУКТОР ДОМАШНИХ СТРАНИЦ ★</p>` | Статичная подпись конструктора. Звёзды - текстовые символы, не картинки или функция. |
| 15 | `<div className="brand-row">` | Контейнер логотипа и маскота. CSS flex располагает их рядом, на телефоне вертикально. |
| 16 | `<h1>WEB SABBATH</h1>` | Главный заголовок страницы. Золотой эффект создаёт CSS, сама строка содержит обычный текст. |
| 17 | `<figure className="mascot-placeholder">` | figure группирует картинку с подписью. className задаёт стиль маленькой плашки. |
| 18 | `<figcaption>Питомец в разработке</figcaption>` | figcaption - подпись к картинке. Это честная заглушка: поведения питомца нет. |
| 19 | `<img src={owlMascot} alt="Чёрно-белая сова со скакалкой - маскот Web Sabbath" />` | img получает URL импортированного PNG через выражение {owlMascot}. alt объясняет изображение без картинки. Самозакрывающийся тег допустим в JSX. |
| 20 | `<p>СОВА НА СКАКАЛКЕ<br />WEB SABBATH PET v0.0</p>` | Две строки подписи, разделённые br. Версия v0.0 декоративная, не механизм обновления пакета. |
| 21 | `</figure>` | Закрывает группу картинки и подписи. |
| 22 | `</div>` | Закрывает строку логотипа и маскота. |
| 23 | `<p className="tagline">СОЗДАЙ САЙТ. ИСПУГАЙ ИНТЕРНЕТ.</p>` | Статичный слоган. Не связан с блоками пользователя. |
| 24 | `<span className="construction-label">UNDER CONSTRUCTION</span>` | Текстовый баннер Under Construction. CSS рисует рамку и лёгкий поворот, а не скачанный GIF. |
| 25 | `</header>` | Закрывает шапку. |
| 26 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 27 | `<div className="builder-layout">` | Открывает контейнер трёх рабочих областей. CSS Grid управляет колонками. |
| 28 | `<BlockToolbar onAdd={addBlock} />` | Передаёт функцию addBlock под именем onAdd. BlockToolbar вызовет её только после клика. Фигурные скобки означают передачу JavaScript-значения. |
| 29 | `<PageEditor blocks={blocks} onUpdate={updateBlock} onDelete={deleteBlock} />` | Передаёт редактору общий blocks и callbacks изменения/удаления. Данные не копируются в отдельный useState дочернего компонента. |
| 30 | `<PagePreview blocks={blocks} />` | Тот же массив передаётся предпросмотру. Это место доказательства: одно состояние влияет на несколько компонентов. |
| 31 | `</div>` | Закрывает контейнер областей. |
| 32 | `<p className="status-bar" role="status">Блоков на странице: {blocks.length}</p>` | Счётчик вычисляется как blocks.length, отдельное состояние счётчика не нужно. role="status" обозначает статусную информацию. |
| 33 | `</main>` | Закрывает main. |
| 34 | `)` | Закрывает выражение return. |
| 35 | `}` | Закрывает функцию App. |
| 36 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 37 | `export default App` | Экспорт по умолчанию позволяет main.jsx импортировать App и запустить его. |

### Файл целиком: что происходит

Общий родитель. Один раз вызывает хук, рисует шапку, передаёт одинаковый массив редактору и предпросмотру. Панели сообщают об изменениях callbacks, а строка статуса вычисляет длину того же массива.

## src/hooks/usePageBlocks.js

Происхождение: Создан нами для текущей учебной реализации.

### Весь файл

```js
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
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `import { useState } from 'react'` | Импорт встроенного useState. Именованный импорт берёт конкретный экспорт пакета react. |
| 2 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 3 | `function usePageBlocks() {` | Объявляет собственный хук usePageBlocks. Имя начинается с use, а внутри реально вызывается React-хук. |
| 4 | `const [blocks, setBlocks] = useState([])` | Деструктуризация результата useState. blocks - массив текущей отрисовки; setBlocks запрашивает обновление. [] - начальное пустое состояние, не постоянное значение всех отрисовок. |
| 5 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 6 | `function addBlock(type) {` | Объявляет callback добавления; type приходит из кнопки панели. |
| 7 | `const block = {` | Начинает новый объект блока. Создаётся при клике, а не при каждом отображении списка. |
| 8 | `id: crypto.randomUUID(),` | crypto.randomUUID создаёт уникальный строковый ID. ID потом используется в key, htmlFor и поиске нужного блока. |
| 9 | `type,` | Сокращённое свойство type эквивалентно type: type. Оно сохраняет аргумент функции в объект. |
| 10 | `text: type === 'heading' ? 'Добро пожаловать на мой сайт!' : 'Здесь живёт мой текст.',` | Тернарный оператор выбирает стартовую строку для heading или text. Меняет только начальный текст нового блока. |
| 11 | `}` | Закрывает объект block. |
| 12 | `setBlocks((current) => [...current, block])` | Функциональный updater получает актуальный предыдущий массив current. Spread создаёт новый массив и добавляет блок в конец. Старый массив не меняется. |
| 13 | `}` | Закрывает addBlock. |
| 14 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 15 | `function updateBlock(id, text) {` | Объявляет callback изменения; аргументы - ID конкретного блока и новая строка. |
| 16 | `setBlocks((current) => current.map((block) => (` | Setter принимает функцию от previous state. map проходит по блокам и создаёт новый массив. Скобка после стрелки позволяет продолжить выражение на следующей строке. |
| 17 | `block.id === id ? { ...block, text } : block` | Сравнивает ID строго через ===. Для совпавшего блока создаёт новый объект {...block, text}, для остальных возвращает прежний объект. ID/type не теряются. |
| 18 | `)))` | Закрывает выражение callback map, сам map, updater и setBlocks. Здесь три закрывающие скобки относятся к трём начатым выражениям. |
| 19 | `}` | Закрывает updateBlock. |
| 20 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 21 | `function deleteBlock(id) {` | Объявляет callback удаления по ID. |
| 22 | `setBlocks((current) => current.filter((block) => block.id !== id))` | filter оставляет блоки с другим ID. !== - строгое неравенство. Создаётся новый массив; при удалении единственного блока получается []. |
| 23 | `}` | Закрывает deleteBlock. |
| 24 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 25 | `return { blocks, addBlock, updateBlock, deleteBlock }` | Возвращает объект данных и функций. Имена свойств совпадают с именами переменных: сокращённая запись. Хук не возвращает HTML. |
| 26 | `}` | Закрывает собственный хук. |
| 27 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 28 | `export default usePageBlocks` | Экспортирует хук по умолчанию для импорта в App. |

### Файл целиком: что происходит

useState хранит массив. addBlock создаёт объект и новый массив, updateBlock заменяет нужный объект через map, deleteBlock отбирает оставшиеся через filter. После setter App пересчитывается и передаёт результат детям. Функции не выполняют HTTP-запросов и не сохраняют данные на диск.

## src/shared/ui/Button.jsx

Происхождение: Создан нами для текущей учебной реализации.

### Весь файл

```jsx
function Button({ children, onClick, className = '', ...props }) {
  return (
    <button type="button" className={`nes-btn ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  )
}

export default Button
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `function Button({ children, onClick, className = '', ...props }) {` | Объявляет общую кнопку. Деструктурирует children, onClick, className; className получает пустую строку по умолчанию. Rest ...props собирает остальные свойства, например disabled. |
| 2 | `return (` | Начинает возврат JSX-кнопки. |
| 3 | `` <button type="button" className={`nes-btn ${className}`} onClick={onClick} {...props}> `` | Обычный HTML-button. type="button" не даёт случайно отправить форму. Шаблонная строка объединяет nes-btn и дополнительный CSS-класс. onClick передаёт callback браузерной кнопке. Spread {...props} прокидывает оставшиеся атрибуты. |
| 4 | `{children}` | Выводит children - текст между тегами Button у вызывающего компонента. Поэтому одна кнопка может иметь разные подписи. |
| 5 | `</button>` | Закрывает HTML-button. |
| 6 | `)` | Закрывает return. |
| 7 | `}` | Закрывает функцию Button. |
| 8 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 9 | `export default Button` | Экспортирует компонент. Кнопка не знает типов блоков и пригодна для повторного использования. |

### Файл целиком: что происходит

Отделяет HTML-button и класс библиотеки от предметной логики. Получает подпись/поведение извне. Именно отсутствие знаний про блоки делает компонент общим.

## src/components/BlockToolbar.jsx

Происхождение: Создан нами для текущей учебной реализации.

### Весь файл

```jsx
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
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `import Button from '@/shared/ui/Button.jsx'` | Импорт общей кнопки через алиас @ из shared, а не локальная копия кнопки. |
| 2 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 3 | `function BlockToolbar({ onAdd }) {` | Панель получает callback onAdd через props. Внутреннего массива блоков здесь нет. |
| 4 | `return (` | Начинает возврат панели. |
| 5 | `<section className="nes-container is-dark workspace-panel elements-panel" aria-labelledby="elements-title">` | section обозначает область, aria-labelledby связывает её с заголовком elements-title. nes-container/is-dark - классы библиотеки; workspace-panel/elements-panel - наша компоновка. |
| 6 | `<h2 id="elements-title"><span className="panel-number">01</span> Элементы</h2>` | Заголовок области с номером. Номер - декоративный текст; id используется атрибутом aria-labelledby. |
| 7 | `<p className="panel-note">Добавь блок в свою страницу</p>` | Подсказка пользователю, что делают кнопки. |
| 8 | `<div className="toolbar-buttons">` | Контейнер кнопок, CSS располагает их вертикально. |
| 9 | `<Button onClick={() => onAdd('heading')}>+ Заголовок</Button>` | Первая общая кнопка. Стрелочная функция откладывает вызов onAdd и передаёт тип heading после клика. |
| 10 | `<Button onClick={() => onAdd('text')}>+ Текст</Button>` | Вторая кнопка вызывает тот же callback с типом text. Переиспользуются Button и общая логика добавления. |
| 11 | `</div>` | Закрывает контейнер кнопок. |
| 12 | `</section>` | Закрывает section. |
| 13 | `)` | Закрывает return. |
| 14 | `}` | Закрывает компонент панели. |
| 15 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 16 | `export default BlockToolbar` | Экспорт панели для использования в App. |

### Файл целиком: что происходит

Только панель команд. После клика передаёт тип блока в функцию из App. Не знает текущий список и не редактирует DOM вручную.

## src/components/BlockEditor.jsx

Происхождение: Создан нами для текущей учебной реализации.

### Весь файл

```jsx
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
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `import Button from '@/shared/ui/Button.jsx'` | Импортирует общую кнопку из shared. Тот же компонент используется в панели добавления. |
| 2 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 3 | `function BlockEditor({ block, onUpdate, onDelete }) {` | Принимает один block и callbacks onUpdate/onDelete через props. Не хранит отдельную копию текста. |
| 4 | `` const inputId = `block-${block.id}` `` | Строит уникальный id поля как block- плюс ID блока. Он связывает label с соответствующим input или textarea. |
| 5 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 6 | `return (` | Начинает возврат редактора одного блока. |
| 7 | `<article className="block-editor">` | article группирует поле и кнопку одного блока. Стиль задан .block-editor. |
| 8 | `<label htmlFor={inputId}>{block.type === 'heading' ? 'Заголовок' : 'Текст'}</label>` | label указывает htmlFor={inputId}. Тернарный оператор выбирает подпись по типу блока, а не по его тексту. |
| 9 | `{block.type === 'heading' ? (` | Начинает условное JSX-выражение. Если тип heading, дальше показывается однострочное поле. |
| 10 | `<input id={inputId} value={block.text} onChange={(event) => onUpdate(block.id, event.target.value)} />` | Управляемый input: value берётся из block.text. onChange получает событие и вызывает onUpdate с ID и event.target.value. JSX-тег закрывается через />. |
| 11 | `) : (` | Разделяет варианты тернарного оператора: после двоеточия идёт вариант для text. |
| 12 | `<textarea id={inputId} rows={4} value={block.text} onChange={(event) => onUpdate(block.id, event.target.value)} />` | Управляемая textarea работает так же, но допускает несколько строк. rows={4} задаёт начальную высоту примерно в четыре строки, это не ограничение длины текста. |
| 13 | `)}` | Закрывает скобку второй JSX-ветки и фигурную скобку условного выражения. |
| 14 | `<Button className="delete-button" onClick={() => onDelete(block.id)}>Удалить блок</Button>` | Общая кнопка получает дополнительный класс delete-button. Callback вызывается при клике с ID именно этого блока. |
| 15 | `</article>` | Закрывает article. |
| 16 | `)` | Закрывает return. |
| 17 | `}` | Закрывает функцию компонента. |
| 18 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 19 | `export default BlockEditor` | Экспортирует редактор блока для PageEditor. |

### Файл целиком: что происходит

Редактор одного объекта: уникальная связь label/поле, управляемое значение, onChange с ID и текстом, удаление по ID. Оба типа используют один компонент; не создаём отдельный компонент на каждую запись.

## src/components/PageEditor.jsx

Происхождение: Создан нами для текущей учебной реализации.

### Весь файл

```jsx
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
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `import BlockEditor from '@/components/BlockEditor.jsx'` | Импорт редактора одного блока через @. |
| 2 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 3 | `function PageEditor({ blocks, onUpdate, onDelete }) {` | Получает общий массив и callbacks. PageEditor распределяет данные, не создаёт новое хранилище. |
| 4 | `return (` | Начинает возврат области. |
| 5 | `<section className="nes-container is-dark workspace-panel editor-panel" aria-labelledby="editor-title">` | section редактора, связанные id/aria-labelledby и CSS-классы. |
| 6 | `<h2 id="editor-title"><span className="panel-number">02</span> Редактор</h2>` | Заголовок редактора с номером 02. |
| 7 | `{blocks.length === 0 ? (` | Проверяет длину массива. Ноль выбирает пустое сообщение, иначе ниже отображается map. |
| 8 | `<p className="empty-message">Пока нет блоков. Добавь заголовок или текст слева.</p>` | Объясняет, что список пуст и как добавить блок. Это состояние интерфейса, не ошибка. |
| 9 | `) : blocks.map((block) => (` | В непустом случае map возвращает JSX для каждого объекта block. Сам map не меняет массив. |
| 10 | `<BlockEditor key={block.id} block={block} onUpdate={onUpdate} onDelete={onDelete} />` | Создаёт BlockEditor для каждого блока. key равен стабильному ID. block и оба callbacks передаются дальше через props. |
| 11 | `))}` | Закрывает callback map и map, затем фигурные скобки условного JSX. |
| 12 | `</section>` | Закрывает section редактора. |
| 13 | `)` | Закрывает return. |
| 14 | `}` | Закрывает PageEditor. |
| 15 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 16 | `export default PageEditor` | Экспорт для App. |

### Файл целиком: что происходит

Управляет представлением списка: пустое сообщение или повторяемые BlockEditor. Стабильные key помогают сохранить идентичность полей при удалении соседей.

## src/components/PagePreview.jsx

Происхождение: Создан нами для текущей учебной реализации.

### Весь файл

```jsx
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
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `function PagePreview({ blocks }) {` | Предпросмотр получает только blocks. Ему не нужны callbacks изменения: он только отображает данные. |
| 2 | `return (` | Начинает возврат области. |
| 3 | `<section className="nes-container is-dark workspace-panel preview-panel" aria-labelledby="preview-title">` | section с доступным именем через preview-title и CSS-классами. |
| 4 | `<h2 id="preview-title"><span className="panel-number">03</span> Предпросмотр</h2>` | Заголовок панели предпросмотра, не заголовок страницы пользователя. |
| 5 | `<div className="page-preview">` | Внутренняя поверхность создаваемой страницы. В ней собственные правила CSS для h3 и p. |
| 6 | `{blocks.length === 0 ? (` | Проверяет пустой массив и начинает условие. |
| 7 | `<p className="preview-empty">Здесь появится твоя страница</p>` | Сообщение пустого предпросмотра. Пользовательская страница пока не содержит блоков. |
| 8 | `) : blocks.map((block) => (` | В непустом случае проходит по массиву через map и возвращает один JSX-элемент для каждого блока. |
| 9 | `block.type === 'heading'` | Проверяет тип блока, чтобы выбрать заголовок или абзац. |
| 10 | `? <h3 key={block.id}>{block.text}</h3>` | Для heading создаёт h3 со стабильным key и выводит строку block.text. Это текст JSX, не вставка HTML через innerHTML. |
| 11 | `: <p key={block.id}>{block.text}</p>` | Для text создаёт p с тем же подходом. CSS сохраняет переносы строк. Все блоки отображаются в порядке массива. |
| 12 | `))}` | Закрывает map и условное JSX-выражение. |
| 13 | `</div>` | Закрывает поверхность предпросмотра. |
| 14 | `</section>` | Закрывает section. |
| 15 | `)` | Закрывает return. |
| 16 | `}` | Закрывает компонент. |
| 17 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 18 | `export default PagePreview` | Экспортирует PagePreview для App. |

### Файл целиком: что происходит

Пассивно строит текстовую страницу из общего массива. Условие типа выбирает h3 или p. Изменение state обновляет результат без кнопки сохранения.

## vite.config.js

Происхождение: Vite создал базовую конфигурацию; Node-импорт и resolve.alias добавлены нами.

### Весь файл

```js
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `import { fileURLToPath, URL } from 'node:url'` | Импорт из встроенного модуля Node.js, не из React. URL строит адрес папки, fileURLToPath переводит его в файловый путь. |
| 2 | `import react from '@vitejs/plugin-react'` | Импорт React-плагина Vite, который обеспечивает обработку React/JSX и обновления разработки. |
| 3 | `import { defineConfig } from 'vite'` | Импорт defineConfig - помощника объявления конфигурации Vite. |
| 4 | (пустая строка) | Пустая строка отделяет части файла; выполняемого действия нет. |
| 5 | `export default defineConfig({` | Экспортирует результат defineConfig, передавая объект настроек. |
| 6 | `plugins: [react()],` | Массив плагинов содержит вызванный React-плагин. |
| 7 | `resolve: {` | Начинает настройки разрешения импортов resolve. |
| 8 | `alias: {` | Начинает таблицу алиасов. |
| 9 | `'@': fileURLToPath(new URL('./src', import.meta.url)),` | Связывает @ с абсолютным путём src, вычисленным относительно этого файла. Путь переносим между компьютерами, в отличие от жёсткого /home/badim. |
| 10 | `},` | Закрывает объект alias. Завершающая запятая допустима в JavaScript. |
| 11 | `},` | Закрывает объект resolve. |
| 12 | `})` | Закрывает объект общей конфигурации и вызов defineConfig. |

### Файл целиком: что происходит

Инструмент запуска и сборки читает эту конфигурацию. react() обрабатывает React, а @ делает импорты от src. Этот файл выполняется средствами Node/Vite, не внутри интерфейса.

## jsconfig.json

Происхождение: Создан нами для поддержки @ в редакторе.

### Весь файл

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `{` | Начинает JSON-объект настроек редактора для JavaScript. Это не исполняемый React-код. |
| 2 | `"compilerOptions": {` | Открывает настройки анализа JavaScript. compilerOptions не делает проект TypeScript. |
| 3 | `"paths": { "@/*": ["./src/*"] }` | Подстановочный путь @/* соответствует ./src/* относительно jsconfig.json. Звёздочка сохраняет остальную часть пути. Устаревший baseUrl удалён; для paths он не нужен. Реальный алиас сборки отдельно задан в vite.config.js. |
| 4 | `},` | Закрывает compilerOptions; запятая отделяет следующее свойство JSON. |
| 5 | `"include": ["src"]` | Ограничивает анализ файлами src, не влияет на установку пакетов npm. |
| 6 | `}` | Закрывает JSON-объект. |

### Файл целиком: что происходит

Редактор понимает, куда ведёт @, и предлагает переходы/подсказки. Файл дополняет конфигурацию Vite, не заменяет её.

## src/index.css

Происхождение: Файл создал Vite; текущие общие стили заменены нами.

### Весь файл

```css
* {
  box-sizing: border-box;
}

html, body {
  font-family: Arial, sans-serif;
}

/* Точки разного размера создают повторяющийся звёздный фон. */
body {
  margin: 0;
  padding: 24px 20px;
  font-size: 16px;
  line-height: 1.5;
  color: #151539;
  background-color: #08082f;
  background-image:
    radial-gradient(circle at 18px 22px, #fff 1px, transparent 1.5px),
    radial-gradient(circle at 90px 70px, #878bd6 1px, transparent 1.5px),
    radial-gradient(circle at 40px 110px, #ffd781 1px, transparent 2px);
  background-size: 150px 130px, 190px 180px, 230px 210px;
  min-height: 100vh;
  cursor: auto;
}

a:focus-visible {
  outline: 2px solid #ffdf3a;
  outline-offset: 6px;
}
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `* {` | Открывает правило для селектора *. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 2 | `box-sizing: border-box;` | border-box включает padding и border в заданную ширину. Так рамки не добавляют неожиданную ширину панелям. Текущее значение: border-box. |
| 3 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 4 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 5 | `html, body {` | Открывает правило для селектора html, body. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 6 | `font-family: Arial, sans-serif;` | Список шрифтов по порядку. Если первый недоступен, браузер берёт следующий. serif/monospace/sans-serif - семейства запасных шрифтов. Текущее значение: Arial, sans-serif. |
| 7 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 8 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 9 | `/* Точки разного размера создают повторяющийся звёздный фон. */` | Комментарий объясняет назначение следующего участка CSS; браузер его не рисует. |
| 10 | `body {` | Открывает правило для селектора body. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 11 | `margin: 0;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0. |
| 12 | `padding: 24px 20px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 24px 20px. |
| 13 | `font-size: 16px;` | Размер букв, а не число символов или размер данных. Текущее значение: 16px. |
| 14 | `line-height: 1.5;` | Высота строки относительно размера шрифта; влияет на читаемость и расстояние строк. Текущее значение: 1.5. |
| 15 | `color: #151539;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #151539. |
| 16 | `background-color: #08082f;` | Цвет фона элемента. Не меняет цвет букв, за него отвечает color. Текущее значение: #08082f. |
| 17 | `background-image:` | Начинает список CSS-изображений фона; следующие строки описывают несколько слоёв. Текущее значение: . |
| 18 | `radial-gradient(circle at 18px 22px, #fff 1px, transparent 1.5px),` | Один слой звёзд: circle задаёт круг, at - положение точки, цвет и радиусы задают светлый центр с прозрачным окружением. Запятая продолжает список слоёв; точка с запятой завершает объявление. |
| 19 | `radial-gradient(circle at 90px 70px, #878bd6 1px, transparent 1.5px),` | Один слой звёзд: circle задаёт круг, at - положение точки, цвет и радиусы задают светлый центр с прозрачным окружением. Запятая продолжает список слоёв; точка с запятой завершает объявление. |
| 20 | `radial-gradient(circle at 40px 110px, #ffd781 1px, transparent 2px);` | Один слой звёзд: circle задаёт круг, at - положение точки, цвет и радиусы задают светлый центр с прозрачным окружением. Запятая продолжает список слоёв; точка с запятой завершает объявление. |
| 21 | `background-size: 150px 130px, 190px 180px, 230px 210px;` | Размер повторяющегося рисунка для каждого слоя звёздного фона, в том же порядке, что слои. Текущее значение: 150px 130px, 190px 180px, 230px 210px. |
| 22 | `min-height: 100vh;` | Задаёт нижнюю границу высоты; при добавлении содержимого блок может расти. Текущее значение: 100vh. |
| 23 | `cursor: auto;` | Вид курсора мыши: pointer для действия, auto для обычной страницы. CSS курсора не создаёт обработчик клика. Текущее значение: auto. |
| 24 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 25 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 26 | `a:focus-visible {` | Открывает правило для селектора a:focus-visible. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 27 | `outline: 2px solid #ffdf3a;` | Контур фокуса, виден при работе клавиатурой. В отличие от border не меняет размер элемента. Текущее значение: 2px solid #ffdf3a. |
| 28 | `outline-offset: 6px;` | Расстояние между контуром фокуса и элементом. Текущее значение: 6px. |
| 29 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |

### Файл целиком: что происходит

Общие размеры и шрифт задают базу страницы. Три точечных градиента рисуют звёзды без изображений. Структуру редактора задаёт App.css, не этот файл.

### CSS-блоки целиком

- *****: совместно задаёт box-sizing. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **html, body**: совместно задаёт font-family. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **body**: совместно задаёт margin, padding, font-size, line-height, color, background-color, background-image, background-size, min-height, cursor. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **a:focus-visible**: совместно задаёт outline, outline-offset. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.

## src/App.css

Происхождение: Файл создал Vite; текущие правила оформления написаны для нашего интерфейса.

### Весь файл

```css
/* Компоновка наша, базовый контейнер - из NES.css. */
.builder {
  max-width: 1100px;
  margin: 0 auto;
}

.builder-header {
  padding: 20px 16px;
  margin-bottom: 24px;
  text-align: center;
  background: linear-gradient(#151550, #08082f);
  border: 4px ridge #cacbdf;
}

.system-label {
  margin: 0 0 12px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #80ffff;
}

/* Золото и несколько теней напоминают старый WordArt. */
.builder-header h1 {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 68px;
  font-weight: bold;
  font-style: italic;
  line-height: 1.2;
  color: #ffdf3a;
  text-shadow: 1px 1px 0 #fff6b0, 3px 3px 0 #aa6000,
    5px 5px 0 #8a19bc, 7px 7px 0 #420568;
}

.tagline {
  margin: 16px 0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
}

.construction-label {
  display: inline-block;
  padding: 5px 14px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: bold;
  color: #000;
  background-color: #ffe330;
  border: 3px dashed #000;
  transform: rotate(-2deg);
}

.builder-layout {
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px;
}

/* Меняем рамку и палитру готового контейнера NES.css. */
.builder .workspace-panel {
  min-width: 0;
  min-height: 360px;
  margin: 0;
  padding: 5px;
  color: #151539;
  background-color: #e3e3e9;
  border: 4px ridge #c8c8d8;
  box-shadow: 3px 3px 0 #000;
}

.builder .workspace-panel::after {
  display: none;
}

.workspace-panel h2 {
  margin: 0 0 16px;
  padding: 8px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(90deg, #000080, #3774c5);
  border: 2px outset #a3bfe0;
}

.editor-panel h2 {
  background: linear-gradient(90deg, #640089, #b443d0);
}

.preview-panel h2 {
  background: linear-gradient(90deg, #005454, #26959e);
}

.panel-number {
  color: #ffef64;
}

.panel-note, .empty-message {
  margin: 0;
  padding: 0 10px 16px;
  font-size: 14px;
}

.empty-message {
  margin: 0 6px;
  padding: 16px 10px;
  color: #454560;
  background-color: #fffef0;
  border: 2px inset #b9b9ca;
}

@media (max-width: 800px) {
  .builder-layout {
    grid-template-columns: 1fr;
  }

  .builder .workspace-panel {
    min-height: 180px;
  }

  .builder-header h1 {
    font-size: 40px;
  }

  .system-label {
    letter-spacing: 0;
  }
}

/* Статичный маскот рядом с названием, пока без поведения. */
.brand-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.mascot-placeholder {
  flex-shrink: 0;
  width: 150px;
  margin: 0;
  padding: 6px;
  color: #000;
  background-color: #fffef0;
  border: 3px ridge #cacbdf;
  transform: rotate(3deg);
}

.mascot-placeholder figcaption {
  padding: 3px;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  font-weight: bold;
  background-color: #ffe330;
  border: 1px dashed #000;
}

.mascot-placeholder img {
  display: block;
  width: 100%;
  height: auto;
  margin: 6px 0;
}

.mascot-placeholder p {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 9px;
  font-weight: bold;
}

@media (max-width: 800px) {
  .brand-row {
    flex-direction: column;
    gap: 16px;
  }
}

.toolbar-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 12px 16px;
}

.builder .nes-btn {
  padding: 6px 8px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  cursor: pointer;
}

.builder .nes-btn:focus-visible {
  outline: 3px solid #000080;
  outline-offset: 5px;
}

.block-editor {
  margin: 12px 6px;
  padding: 12px;
  background-color: #fffef0;
  border: 2px inset #b9b9ca;
}

.block-editor label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: bold;
}

.block-editor input, .block-editor textarea {
  width: 100%;
  min-width: 0;
  padding: 8px;
  font: inherit;
  font-size: 14px;
  color: #151539;
  background-color: #fff;
  border: 2px inset #b9b9ca;
}

.block-editor textarea {
  resize: vertical;
}

.block-editor input:focus-visible, .block-editor textarea:focus-visible {
  outline: 2px solid #000080;
}

.block-editor .delete-button {
  margin-top: 12px;
}

.page-preview {
  min-height: 260px;
  margin: 0 6px 6px;
  padding: 16px 12px;
  overflow-wrap: anywhere;
  background-color: #fffef0;
  border: 2px inset #b9b9ca;
}

.page-preview h3 {
  margin: 0 0 16px;
  font-size: 22px;
}

.page-preview p {
  margin: 0 0 16px;
  white-space: pre-wrap;
}

.page-preview .preview-empty {
  font-size: 14px;
  color: #454560;
}

.status-bar {
  margin: 20px 0 0;
  padding: 8px 12px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #fff;
  background-color: #151550;
  border: 2px ridge #cacbdf;
}
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `/* Компоновка наша, базовый контейнер - из NES.css. */` | Комментарий объясняет назначение следующего участка CSS; браузер его не рисует. |
| 2 | `.builder {` | Открывает правило для селектора .builder. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 3 | `max-width: 1100px;` | Ограничивает максимальную ширину элемента; он может быть уже на маленьком экране. Текущее значение: 1100px. |
| 4 | `margin: 0 auto;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0 auto. |
| 5 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 6 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 7 | `.builder-header {` | Открывает правило для селектора .builder-header. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 8 | `padding: 20px 16px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 20px 16px. |
| 9 | `margin-bottom: 24px;` | Внешний отступ снизу; создаёт расстояние до следующего элемента. Текущее значение: 24px. |
| 10 | `text-align: center;` | Горизонтальное выравнивание текста внутри блока. center центрирует строки. Текущее значение: center. |
| 11 | `background: linear-gradient(#151550, #08082f);` | Сокращённая настройка фона. linear-gradient рисует переход цветов средствами CSS, отдельной картинки нет. Текущее значение: linear-gradient(#151550, #08082f). |
| 12 | `border: 4px ridge #cacbdf;` | Ширина, стиль и цвет рамки. ridge/outset/inset дают объём, dashed - штрихи, solid - сплошную линию. Текущее значение: 4px ridge #cacbdf. |
| 13 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 14 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 15 | `.system-label {` | Открывает правило для селектора .system-label. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 16 | `margin: 0 0 12px;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0 0 12px. |
| 17 | `font-family: 'Courier New', monospace;` | Список шрифтов по порядку. Если первый недоступен, браузер берёт следующий. serif/monospace/sans-serif - семейства запасных шрифтов. Текущее значение: 'Courier New', monospace. |
| 18 | `font-size: 12px;` | Размер букв, а не число символов или размер данных. Текущее значение: 12px. |
| 19 | `font-weight: bold;` | Толщина начертания. bold выделяет заголовок или подпись. Текущее значение: bold. |
| 20 | `letter-spacing: 2px;` | Расстояние между символами; декоративный приём для заголовка. 0 возвращает обычные интервалы. Текущее значение: 2px. |
| 21 | `color: #80ffff;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #80ffff. |
| 22 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 23 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 24 | `/* Золото и несколько теней напоминают старый WordArt. */` | Комментарий объясняет назначение следующего участка CSS; браузер его не рисует. |
| 25 | `.builder-header h1 {` | Открывает правило для селектора .builder-header h1. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 26 | `margin: 0;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0. |
| 27 | `font-family: Georgia, 'Times New Roman', serif;` | Список шрифтов по порядку. Если первый недоступен, браузер берёт следующий. serif/monospace/sans-serif - семейства запасных шрифтов. Текущее значение: Georgia, 'Times New Roman', serif. |
| 28 | `font-size: 68px;` | Размер букв, а не число символов или размер данных. Текущее значение: 68px. |
| 29 | `font-weight: bold;` | Толщина начертания. bold выделяет заголовок или подпись. Текущее значение: bold. |
| 30 | `font-style: italic;` | italic наклоняет надпись WordArt. Текущее значение: italic. |
| 31 | `line-height: 1.2;` | Высота строки относительно размера шрифта; влияет на читаемость и расстояние строк. Текущее значение: 1.2. |
| 32 | `color: #ffdf3a;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #ffdf3a. |
| 33 | `text-shadow: 1px 1px 0 #fff6b0, 3px 3px 0 #aa6000,` | Тени букв. Несколько цветных сдвигов создают объём WordArt; не относятся к тени всего окна. Текущее значение: 1px 1px 0 #fff6b0, 3px 3px 0 #aa6000,. |
| 34 | `5px 5px 0 #8a19bc, 7px 7px 0 #420568;` | Продолжает объявление text-shadow из предыдущей строки: добавляет фиолетовые смещённые слои для объёма. Точка с запятой завершает весь список теней. |
| 35 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 36 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 37 | `.tagline {` | Открывает правило для селектора .tagline. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 38 | `margin: 16px 0;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 16px 0. |
| 39 | `font-family: 'Courier New', monospace;` | Список шрифтов по порядку. Если первый недоступен, браузер берёт следующий. serif/monospace/sans-serif - семейства запасных шрифтов. Текущее значение: 'Courier New', monospace. |
| 40 | `font-size: 14px;` | Размер букв, а не число символов или размер данных. Текущее значение: 14px. |
| 41 | `font-weight: bold;` | Толщина начертания. bold выделяет заголовок или подпись. Текущее значение: bold. |
| 42 | `color: #fff;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #fff. |
| 43 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 44 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 45 | `.construction-label {` | Открывает правило для селектора .construction-label. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 46 | `display: inline-block;` | Выбирает модель отображения: grid - сетка, flex - гибкая строка/колонка, block - отдельный блок, inline-block - плашка по содержимому, none скрывает элемент. Текущее значение: inline-block. |
| 47 | `padding: 5px 14px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 5px 14px. |
| 48 | `font-family: 'Courier New', monospace;` | Список шрифтов по порядку. Если первый недоступен, браузер берёт следующий. serif/monospace/sans-serif - семейства запасных шрифтов. Текущее значение: 'Courier New', monospace. |
| 49 | `font-size: 11px;` | Размер букв, а не число символов или размер данных. Текущее значение: 11px. |
| 50 | `font-weight: bold;` | Толщина начертания. bold выделяет заголовок или подпись. Текущее значение: bold. |
| 51 | `color: #000;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #000. |
| 52 | `background-color: #ffe330;` | Цвет фона элемента. Не меняет цвет букв, за него отвечает color. Текущее значение: #ffe330. |
| 53 | `border: 3px dashed #000;` | Ширина, стиль и цвет рамки. ridge/outset/inset дают объём, dashed - штрихи, solid - сплошную линию. Текущее значение: 3px dashed #000. |
| 54 | `transform: rotate(-2deg);` | rotate поворачивает плашку визуально, не меняя её место в потоке. Это декоративный эффект, а не анимация. Текущее значение: rotate(-2deg). |
| 55 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 56 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 57 | `.builder-layout {` | Открывает правило для селектора .builder-layout. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 58 | `display: grid;` | Выбирает модель отображения: grid - сетка, flex - гибкая строка/колонка, block - отдельный блок, inline-block - плашка по содержимому, none скрывает элемент. Текущее значение: grid. |
| 59 | `grid-template-columns: 200px minmax(0, 1fr) minmax(0, 1fr);` | Ширины колонок. 200px - панель элементов, minmax(0, 1fr) - остальные делят остаток и могут сжиматься. 1fr в media query оставляет одну колонку. Текущее значение: 200px minmax(0, 1fr) minmax(0, 1fr). |
| 60 | `gap: 20px;` | Расстояние между элементами Grid/Flex, не padding каждого элемента. Текущее значение: 20px. |
| 61 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 62 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 63 | `/* Меняем рамку и палитру готового контейнера NES.css. */` | Комментарий объясняет назначение следующего участка CSS; браузер его не рисует. |
| 64 | `.builder .workspace-panel {` | Открывает правило для селектора .builder .workspace-panel. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 65 | `min-width: 0;` | Минимальная ширина. Значение 0 позволяет содержимому Grid/Flex сжиматься вместо распирания колонки. Текущее значение: 0. |
| 66 | `min-height: 360px;` | Задаёт нижнюю границу высоты; при добавлении содержимого блок может расти. Текущее значение: 360px. |
| 67 | `margin: 0;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0. |
| 68 | `padding: 5px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 5px. |
| 69 | `color: #151539;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #151539. |
| 70 | `background-color: #e3e3e9;` | Цвет фона элемента. Не меняет цвет букв, за него отвечает color. Текущее значение: #e3e3e9. |
| 71 | `border: 4px ridge #c8c8d8;` | Ширина, стиль и цвет рамки. ridge/outset/inset дают объём, dashed - штрихи, solid - сплошную линию. Текущее значение: 4px ridge #c8c8d8. |
| 72 | `box-shadow: 3px 3px 0 #000;` | Тень элемента. Первые числа - горизонтальный/вертикальный сдвиг. inset означает внутреннюю тень; несколько теней отделяются запятыми. Текущее значение: 3px 3px 0 #000. |
| 73 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 74 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 75 | `.builder .workspace-panel::after {` | Открывает правило для селектора .builder .workspace-panel::after. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 76 | `display: none;` | Выбирает модель отображения: grid - сетка, flex - гибкая строка/колонка, block - отдельный блок, inline-block - плашка по содержимому, none скрывает элемент. Текущее значение: none. |
| 77 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 78 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 79 | `.workspace-panel h2 {` | Открывает правило для селектора .workspace-panel h2. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 80 | `margin: 0 0 16px;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0 0 16px. |
| 81 | `padding: 8px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 8px. |
| 82 | `font-family: 'Courier New', monospace;` | Список шрифтов по порядку. Если первый недоступен, браузер берёт следующий. serif/monospace/sans-serif - семейства запасных шрифтов. Текущее значение: 'Courier New', monospace. |
| 83 | `font-size: 16px;` | Размер букв, а не число символов или размер данных. Текущее значение: 16px. |
| 84 | `font-weight: bold;` | Толщина начертания. bold выделяет заголовок или подпись. Текущее значение: bold. |
| 85 | `color: #fff;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #fff. |
| 86 | `background: linear-gradient(90deg, #000080, #3774c5);` | Сокращённая настройка фона. linear-gradient рисует переход цветов средствами CSS, отдельной картинки нет. Текущее значение: linear-gradient(90deg, #000080, #3774c5). |
| 87 | `border: 2px outset #a3bfe0;` | Ширина, стиль и цвет рамки. ridge/outset/inset дают объём, dashed - штрихи, solid - сплошную линию. Текущее значение: 2px outset #a3bfe0. |
| 88 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 89 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 90 | `.editor-panel h2 {` | Открывает правило для селектора .editor-panel h2. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 91 | `background: linear-gradient(90deg, #640089, #b443d0);` | Сокращённая настройка фона. linear-gradient рисует переход цветов средствами CSS, отдельной картинки нет. Текущее значение: linear-gradient(90deg, #640089, #b443d0). |
| 92 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 93 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 94 | `.preview-panel h2 {` | Открывает правило для селектора .preview-panel h2. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 95 | `background: linear-gradient(90deg, #005454, #26959e);` | Сокращённая настройка фона. linear-gradient рисует переход цветов средствами CSS, отдельной картинки нет. Текущее значение: linear-gradient(90deg, #005454, #26959e). |
| 96 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 97 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 98 | `.panel-number {` | Открывает правило для селектора .panel-number. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 99 | `color: #ffef64;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #ffef64. |
| 100 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 101 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 102 | `.panel-note, .empty-message {` | Открывает правило для селектора .panel-note, .empty-message. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 103 | `margin: 0;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0. |
| 104 | `padding: 0 10px 16px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 0 10px 16px. |
| 105 | `font-size: 14px;` | Размер букв, а не число символов или размер данных. Текущее значение: 14px. |
| 106 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 107 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 108 | `.empty-message {` | Открывает правило для селектора .empty-message. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 109 | `margin: 0 6px;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0 6px. |
| 110 | `padding: 16px 10px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 16px 10px. |
| 111 | `color: #454560;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #454560. |
| 112 | `background-color: #fffef0;` | Цвет фона элемента. Не меняет цвет букв, за него отвечает color. Текущее значение: #fffef0. |
| 113 | `border: 2px inset #b9b9ca;` | Ширина, стиль и цвет рамки. ridge/outset/inset дают объём, dashed - штрихи, solid - сплошную линию. Текущее значение: 2px inset #b9b9ca. |
| 114 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 115 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 116 | `@media (max-width: 800px) {` | Начинает условную группу правил: они применяются при ширине viewport не более 800px. Это адаптивность, не JavaScript-условие. |
| 117 | `.builder-layout {` | Открывает правило для селектора .builder-layout. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 118 | `grid-template-columns: 1fr;` | Ширины колонок. 200px - панель элементов, minmax(0, 1fr) - остальные делят остаток и могут сжиматься. 1fr в media query оставляет одну колонку. Текущее значение: 1fr. |
| 119 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 120 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 121 | `.builder .workspace-panel {` | Открывает правило для селектора .builder .workspace-panel. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 122 | `min-height: 180px;` | Задаёт нижнюю границу высоты; при добавлении содержимого блок может расти. Текущее значение: 180px. |
| 123 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 124 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 125 | `.builder-header h1 {` | Открывает правило для селектора .builder-header h1. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 126 | `font-size: 40px;` | Размер букв, а не число символов или размер данных. Текущее значение: 40px. |
| 127 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 128 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 129 | `.system-label {` | Открывает правило для селектора .system-label. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 130 | `letter-spacing: 0;` | Расстояние между символами; декоративный приём для заголовка. 0 возвращает обычные интервалы. Текущее значение: 0. |
| 131 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 132 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 133 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 134 | `/* Статичный маскот рядом с названием, пока без поведения. */` | Комментарий объясняет назначение следующего участка CSS; браузер его не рисует. |
| 135 | `.brand-row {` | Открывает правило для селектора .brand-row. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 136 | `display: flex;` | Выбирает модель отображения: grid - сетка, flex - гибкая строка/колонка, block - отдельный блок, inline-block - плашка по содержимому, none скрывает элемент. Текущее значение: flex. |
| 137 | `align-items: center;` | Выравнивание дочерних элементов по поперечной оси Flex. При горизонтальной строке center центрирует их по высоте. Текущее значение: center. |
| 138 | `justify-content: center;` | Расположение элементов вдоль главной оси Flex. center собирает логотип и плашку по центру. Текущее значение: center. |
| 139 | `gap: 24px;` | Расстояние между элементами Grid/Flex, не padding каждого элемента. Текущее значение: 24px. |
| 140 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 141 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 142 | `.mascot-placeholder {` | Открывает правило для селектора .mascot-placeholder. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 143 | `flex-shrink: 0;` | 0 запрещает сжимать плашку маскота меньше заданной ширины в Flex. Текущее значение: 0. |
| 144 | `width: 150px;` | Ширина элемента. 100% занимает доступную ширину родителя, px фиксирует размер плашки. Текущее значение: 150px. |
| 145 | `margin: 0;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0. |
| 146 | `padding: 6px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 6px. |
| 147 | `color: #000;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #000. |
| 148 | `background-color: #fffef0;` | Цвет фона элемента. Не меняет цвет букв, за него отвечает color. Текущее значение: #fffef0. |
| 149 | `border: 3px ridge #cacbdf;` | Ширина, стиль и цвет рамки. ridge/outset/inset дают объём, dashed - штрихи, solid - сплошную линию. Текущее значение: 3px ridge #cacbdf. |
| 150 | `transform: rotate(3deg);` | rotate поворачивает плашку визуально, не меняя её место в потоке. Это декоративный эффект, а не анимация. Текущее значение: rotate(3deg). |
| 151 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 152 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 153 | `.mascot-placeholder figcaption {` | Открывает правило для селектора .mascot-placeholder figcaption. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 154 | `padding: 3px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 3px. |
| 155 | `font-family: 'Courier New', monospace;` | Список шрифтов по порядку. Если первый недоступен, браузер берёт следующий. serif/monospace/sans-serif - семейства запасных шрифтов. Текущее значение: 'Courier New', monospace. |
| 156 | `font-size: 10px;` | Размер букв, а не число символов или размер данных. Текущее значение: 10px. |
| 157 | `font-weight: bold;` | Толщина начертания. bold выделяет заголовок или подпись. Текущее значение: bold. |
| 158 | `background-color: #ffe330;` | Цвет фона элемента. Не меняет цвет букв, за него отвечает color. Текущее значение: #ffe330. |
| 159 | `border: 1px dashed #000;` | Ширина, стиль и цвет рамки. ridge/outset/inset дают объём, dashed - штрихи, solid - сплошную линию. Текущее значение: 1px dashed #000. |
| 160 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 161 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 162 | `.mascot-placeholder img {` | Открывает правило для селектора .mascot-placeholder img. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 163 | `display: block;` | Выбирает модель отображения: grid - сетка, flex - гибкая строка/колонка, block - отдельный блок, inline-block - плашка по содержимому, none скрывает элемент. Текущее значение: block. |
| 164 | `width: 100%;` | Ширина элемента. 100% занимает доступную ширину родителя, px фиксирует размер плашки. Текущее значение: 100%. |
| 165 | `height: auto;` | Высота. auto у картинки сохраняет исходные пропорции при изменении ширины. Текущее значение: auto. |
| 166 | `margin: 6px 0;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 6px 0. |
| 167 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 168 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 169 | `.mascot-placeholder p {` | Открывает правило для селектора .mascot-placeholder p. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 170 | `margin: 0;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0. |
| 171 | `font-family: 'Courier New', monospace;` | Список шрифтов по порядку. Если первый недоступен, браузер берёт следующий. serif/monospace/sans-serif - семейства запасных шрифтов. Текущее значение: 'Courier New', monospace. |
| 172 | `font-size: 9px;` | Размер букв, а не число символов или размер данных. Текущее значение: 9px. |
| 173 | `font-weight: bold;` | Толщина начертания. bold выделяет заголовок или подпись. Текущее значение: bold. |
| 174 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 175 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 176 | `@media (max-width: 800px) {` | Начинает условную группу правил: они применяются при ширине viewport не более 800px. Это адаптивность, не JavaScript-условие. |
| 177 | `.brand-row {` | Открывает правило для селектора .brand-row. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 178 | `flex-direction: column;` | Меняет направление Flex. column располагает элементы сверху вниз. Текущее значение: column. |
| 179 | `gap: 16px;` | Расстояние между элементами Grid/Flex, не padding каждого элемента. Текущее значение: 16px. |
| 180 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 181 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 182 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 183 | `.toolbar-buttons {` | Открывает правило для селектора .toolbar-buttons. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 184 | `display: flex;` | Выбирает модель отображения: grid - сетка, flex - гибкая строка/колонка, block - отдельный блок, inline-block - плашка по содержимому, none скрывает элемент. Текущее значение: flex. |
| 185 | `flex-direction: column;` | Меняет направление Flex. column располагает элементы сверху вниз. Текущее значение: column. |
| 186 | `gap: 16px;` | Расстояние между элементами Grid/Flex, не padding каждого элемента. Текущее значение: 16px. |
| 187 | `padding: 0 12px 16px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 0 12px 16px. |
| 188 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 189 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 190 | `.builder .nes-btn {` | Открывает правило для селектора .builder .nes-btn. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 191 | `padding: 6px 8px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 6px 8px. |
| 192 | `font-family: Arial, sans-serif;` | Список шрифтов по порядку. Если первый недоступен, браузер берёт следующий. serif/monospace/sans-serif - семейства запасных шрифтов. Текущее значение: Arial, sans-serif. |
| 193 | `font-size: 13px;` | Размер букв, а не число символов или размер данных. Текущее значение: 13px. |
| 194 | `cursor: pointer;` | Вид курсора мыши: pointer для действия, auto для обычной страницы. CSS курсора не создаёт обработчик клика. Текущее значение: pointer. |
| 195 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 196 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 197 | `.builder .nes-btn:focus-visible {` | Открывает правило для селектора .builder .nes-btn:focus-visible. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 198 | `outline: 3px solid #000080;` | Контур фокуса, виден при работе клавиатурой. В отличие от border не меняет размер элемента. Текущее значение: 3px solid #000080. |
| 199 | `outline-offset: 5px;` | Расстояние между контуром фокуса и элементом. Текущее значение: 5px. |
| 200 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 201 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 202 | `.block-editor {` | Открывает правило для селектора .block-editor. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 203 | `margin: 12px 6px;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 12px 6px. |
| 204 | `padding: 12px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 12px. |
| 205 | `background-color: #fffef0;` | Цвет фона элемента. Не меняет цвет букв, за него отвечает color. Текущее значение: #fffef0. |
| 206 | `border: 2px inset #b9b9ca;` | Ширина, стиль и цвет рамки. ridge/outset/inset дают объём, dashed - штрихи, solid - сплошную линию. Текущее значение: 2px inset #b9b9ca. |
| 207 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 208 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 209 | `.block-editor label {` | Открывает правило для селектора .block-editor label. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 210 | `display: block;` | Выбирает модель отображения: grid - сетка, flex - гибкая строка/колонка, block - отдельный блок, inline-block - плашка по содержимому, none скрывает элемент. Текущее значение: block. |
| 211 | `margin-bottom: 8px;` | Внешний отступ снизу; создаёт расстояние до следующего элемента. Текущее значение: 8px. |
| 212 | `font-size: 14px;` | Размер букв, а не число символов или размер данных. Текущее значение: 14px. |
| 213 | `font-weight: bold;` | Толщина начертания. bold выделяет заголовок или подпись. Текущее значение: bold. |
| 214 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 215 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 216 | `.block-editor input, .block-editor textarea {` | Открывает правило для селектора .block-editor input, .block-editor textarea. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 217 | `width: 100%;` | Ширина элемента. 100% занимает доступную ширину родителя, px фиксирует размер плашки. Текущее значение: 100%. |
| 218 | `min-width: 0;` | Минимальная ширина. Значение 0 позволяет содержимому Grid/Flex сжиматься вместо распирания колонки. Текущее значение: 0. |
| 219 | `padding: 8px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 8px. |
| 220 | `font: inherit;` | Сокращённая настройка шрифта. inherit получает параметры от родителя; последующий font-size уточняет размер. Текущее значение: inherit. |
| 221 | `font-size: 14px;` | Размер букв, а не число символов или размер данных. Текущее значение: 14px. |
| 222 | `color: #151539;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #151539. |
| 223 | `background-color: #fff;` | Цвет фона элемента. Не меняет цвет букв, за него отвечает color. Текущее значение: #fff. |
| 224 | `border: 2px inset #b9b9ca;` | Ширина, стиль и цвет рамки. ridge/outset/inset дают объём, dashed - штрихи, solid - сплошную линию. Текущее значение: 2px inset #b9b9ca. |
| 225 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 226 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 227 | `.block-editor textarea {` | Открывает правило для селектора .block-editor textarea. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 228 | `resize: vertical;` | vertical разрешает пользователю менять высоту textarea, но не ширину. Текущее значение: vertical. |
| 229 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 230 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 231 | `.block-editor input:focus-visible, .block-editor textarea:focus-visible {` | Открывает правило для селектора .block-editor input:focus-visible, .block-editor textarea:focus-visible. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 232 | `outline: 2px solid #000080;` | Контур фокуса, виден при работе клавиатурой. В отличие от border не меняет размер элемента. Текущее значение: 2px solid #000080. |
| 233 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 234 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 235 | `.block-editor .delete-button {` | Открывает правило для селектора .block-editor .delete-button. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 236 | `margin-top: 12px;` | Внешний отступ сверху; отделяет элемент от предыдущего. Текущее значение: 12px. |
| 237 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 238 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 239 | `.page-preview {` | Открывает правило для селектора .page-preview. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 240 | `min-height: 260px;` | Задаёт нижнюю границу высоты; при добавлении содержимого блок может расти. Текущее значение: 260px. |
| 241 | `margin: 0 6px 6px;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0 6px 6px. |
| 242 | `padding: 16px 12px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 16px 12px. |
| 243 | `overflow-wrap: anywhere;` | anywhere допускает перенос даже длинного слова/URL и защищает предпросмотр от горизонтального переполнения. Текущее значение: anywhere. |
| 244 | `background-color: #fffef0;` | Цвет фона элемента. Не меняет цвет букв, за него отвечает color. Текущее значение: #fffef0. |
| 245 | `border: 2px inset #b9b9ca;` | Ширина, стиль и цвет рамки. ridge/outset/inset дают объём, dashed - штрихи, solid - сплошную линию. Текущее значение: 2px inset #b9b9ca. |
| 246 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 247 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 248 | `.page-preview h3 {` | Открывает правило для селектора .page-preview h3. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 249 | `margin: 0 0 16px;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0 0 16px. |
| 250 | `font-size: 22px;` | Размер букв, а не число символов или размер данных. Текущее значение: 22px. |
| 251 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 252 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 253 | `.page-preview p {` | Открывает правило для селектора .page-preview p. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 254 | `margin: 0 0 16px;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 0 0 16px. |
| 255 | `white-space: pre-wrap;` | pre-wrap сохраняет переносы строк текста и позволяет перенос по ширине. Текущее значение: pre-wrap. |
| 256 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 257 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 258 | `.page-preview .preview-empty {` | Открывает правило для селектора .page-preview .preview-empty. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 259 | `font-size: 14px;` | Размер букв, а не число символов или размер данных. Текущее значение: 14px. |
| 260 | `color: #454560;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #454560. |
| 261 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |
| 262 | (пустая строка) | Пустая строка отделяет правила для чтения; не создаёт отступ на странице. |
| 263 | `.status-bar {` | Открывает правило для селектора .status-bar. Точка обозначает класс, пробел - потомка, запятая - несколько селекторов. :focus-visible выделяет клавиатурный фокус, ::after - псевдоэлемент. Правило .builder .workspace-panel перекрывает часть библиотечного оформления. |
| 264 | `margin: 20px 0 0;` | Внешние отступы: 1 значение на все стороны, 2 - вертикаль/горизонталь, 3 - верх/бока/низ. auto по бокам центрирует ограниченный блок. Текущее значение: 20px 0 0. |
| 265 | `padding: 8px 12px;` | Внутренние отступы между рамкой и содержимым. Два значения - вертикаль/горизонталь, три - верх/бока/низ. Текущее значение: 8px 12px. |
| 266 | `font-family: 'Courier New', monospace;` | Список шрифтов по порядку. Если первый недоступен, браузер берёт следующий. serif/monospace/sans-serif - семейства запасных шрифтов. Текущее значение: 'Courier New', monospace. |
| 267 | `font-size: 13px;` | Размер букв, а не число символов или размер данных. Текущее значение: 13px. |
| 268 | `color: #fff;` | Цвет текста. Hex задаёт RGB; сокращённый #fff означает белый. Текущее значение: #fff. |
| 269 | `background-color: #151550;` | Цвет фона элемента. Не меняет цвет букв, за него отвечает color. Текущее значение: #151550. |
| 270 | `border: 2px ridge #cacbdf;` | Ширина, стиль и цвет рамки. ridge/outset/inset дают объём, dashed - штрихи, solid - сплошную линию. Текущее значение: 2px ridge #cacbdf. |
| 271 | `}` | Закрывает текущее CSS-правило или media query; после него следующие настройки относятся к другому блоку. |

### Файл целиком: что происходит

Сначала оформление шапки/панелей, затем адаптивность, маскот и элементы редактора. CSS не изменяет React state. NES.css даёт основу контейнеров и кнопок, здесь задаются наши переопределения.

### CSS-блоки целиком

- **.builder**: совместно задаёт max-width, margin. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.builder-header**: совместно задаёт padding, margin-bottom, text-align, background, border. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.system-label**: совместно задаёт margin, font-family, font-size, font-weight, letter-spacing, color. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.builder-header h1**: совместно задаёт margin, font-family, font-size, font-weight, font-style, line-height, color, text-shadow. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.tagline**: совместно задаёт margin, font-family, font-size, font-weight, color. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.construction-label**: совместно задаёт display, padding, font-family, font-size, font-weight, color, background-color, border, transform. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.builder-layout**: совместно задаёт display, grid-template-columns, gap. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.builder .workspace-panel**: совместно задаёт min-width, min-height, margin, padding, color, background-color, border, box-shadow. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.builder .workspace-panel::after**: совместно задаёт display. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.workspace-panel h2**: совместно задаёт margin, padding, font-family, font-size, font-weight, color, background, border. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.editor-panel h2**: совместно задаёт background. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.preview-panel h2**: совместно задаёт background. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.panel-number**: совместно задаёт color. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.panel-note, .empty-message**: совместно задаёт margin, padding, font-size. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.empty-message**: совместно задаёт margin, padding, color, background-color, border. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.builder-layout**: совместно задаёт grid-template-columns. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.builder .workspace-panel**: совместно задаёт min-height. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.builder-header h1**: совместно задаёт font-size. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.system-label**: совместно задаёт letter-spacing. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.brand-row**: совместно задаёт display, align-items, justify-content, gap. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.mascot-placeholder**: совместно задаёт flex-shrink, width, margin, padding, color, background-color, border, transform. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.mascot-placeholder figcaption**: совместно задаёт padding, font-family, font-size, font-weight, background-color, border. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.mascot-placeholder img**: совместно задаёт display, width, height, margin. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.mascot-placeholder p**: совместно задаёт margin, font-family, font-size, font-weight. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.brand-row**: совместно задаёт flex-direction, gap. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.toolbar-buttons**: совместно задаёт display, flex-direction, gap, padding. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.builder .nes-btn**: совместно задаёт padding, font-family, font-size, cursor. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.builder .nes-btn:focus-visible**: совместно задаёт outline, outline-offset. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.block-editor**: совместно задаёт margin, padding, background-color, border. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.block-editor label**: совместно задаёт display, margin-bottom, font-size, font-weight. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.block-editor input, .block-editor textarea**: совместно задаёт width, min-width, padding, font, font-size, color, background-color, border. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.block-editor textarea**: совместно задаёт resize. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.block-editor input:focus-visible, .block-editor textarea:focus-visible**: совместно задаёт outline. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.block-editor .delete-button**: совместно задаёт margin-top. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.page-preview**: совместно задаёт min-height, margin, padding, overflow-wrap, background-color, border. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.page-preview h3**: совместно задаёт margin, font-size. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.page-preview p**: совместно задаёт margin, white-space. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.page-preview .preview-empty**: совместно задаёт font-size, color. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.
- **.status-bar**: совместно задаёт margin, padding, font-family, font-size, color, background-color, border. Это оформление соответствующих элементов, не изменение данных. Значения и последствия каждого свойства разобраны выше.

## package.json

Происхождение: Основа автоматически создана Vite; имя muse задано при подготовке, NES.css добавлен через npm. Остальные зависимости/команды - шаблон.

### Весь файл

```json
{
  "name": "muse",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "nes.css": "^2.2.1",
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.7",
    "@vitejs/plugin-react": "^6.1.1",
    "oxlint": "^1.81.0",
    "vite": "^8.3.0"
  }
}
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `{` | Структурная скобка JSON: открывает/закрывает объект. Запятая отделяет соседние свойства, она не является содержимым строки. |
| 2 | `"name": "muse",` | Техническое имя npm-пакета muse осталось от первого проекта. Это не название GitHub-репозитория и не текст вкладки. |
| 3 | `"private": true,` | true запрещает случайно публиковать этот npm-пакет. Не делает GitHub-репозиторий приватным. |
| 4 | `"version": "0.0.0",` | Версия npm-проекта 0.0.0, не версия React. |
| 5 | `"type": "module",` | module включает синтаксис ES-модулей import/export для JavaScript в среде Node проекта. |
| 6 | `"scripts": {` | Открывает таблицу команд npm run. |
| 7 | `"dev": "vite",` | npm run dev запускает vite - локальный сервер разработки. |
| 8 | `"build": "vite build",` | npm run build запускает vite build и создаёт dist. |
| 9 | `"lint": "oxlint",` | npm run lint запускает oxlint для статической проверки. |
| 10 | `"preview": "vite preview"` | npm run preview запускает локальный просмотр уже собранного dist, не публикацию на внешнем хостинге. |
| 11 | `},` | Структурная скобка JSON: открывает/закрывает объект. Запятая отделяет соседние свойства, она не является содержимым строки. |
| 12 | `"dependencies": {` | Начинает прямые зависимости проекта. Их файлы установлены в node_modules, не написаны нами. |
| 13 | `"nes.css": "^2.2.1",` | Готовая CSS-библиотека контейнеров/кнопок. Запись появилась после npm install nes.css. ^2.2.1 задаёт допустимый диапазон; точная версия в lock-файле. |
| 14 | `"react": "^19.2.8",` | React для компонентов и хуков. Диапазон версии - не гарантия одной конкретной установленной версии. |
| 15 | `"react-dom": "^19.2.8"` | Связь React с DOM браузера, включая createRoot. |
| 16 | `},` | Структурная скобка JSON: открывает/закрывает объект. Запятая отделяет соседние свойства, она не является содержимым строки. |
| 17 | `"devDependencies": {` | Начинает зависимости инструментов разработки. Не все они попадут в браузерную сборку. |
| 18 | `"@types/react": "^19.2.18",` | Описания типов React для инструментов/редактора из шаблона. Сам проект JavaScript, файлов .ts/.tsx нет. |
| 19 | `"@types/react-dom": "^19.2.7",` | Типовые сведения для React DOM, также из шаблона. |
| 20 | `"@vitejs/plugin-react": "^6.1.1",` | Плагин обработки React в Vite, вызывается в vite.config.js. |
| 21 | `"oxlint": "^1.81.0",` | Пакет линтера. Нужен команде lint, не конструктору в браузере. |
| 22 | `"vite": "^8.3.0"` | Пакет инструмента запуска/сборки. |
| 23 | `}` | Структурная скобка JSON: открывает/закрывает объект. Запятая отделяет соседние свойства, она не является содержимым строки. |
| 24 | `}` | Структурная скобка JSON: открывает/закрывает объект. Запятая отделяет соседние свойства, она не является содержимым строки. |

### Файл целиком: что происходит

Манифест для npm. scripts - команды запуска, dependencies - прямые пакеты, devDependencies - инструменты разработки. Это не список всех транзитивных файлов в node_modules.

## .oxlintrc.json

Происхождение: Автоматическая конфигурация oxlint из шаблона. Мы её не переписывали, но объясняем назначение каждой строки.

### Весь файл

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "oxc"],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `{` | Структурная скобка JSON: открывает/закрывает объект. Запятая отделяет соседние свойства, она не является содержимым строки. |
| 2 | `"$schema": "./node_modules/oxlint/configuration_schema.json",` | Ссылка на схему JSON-конфигурации oxlint для подсказок редактора. Путь ведёт в установленный пакет. |
| 3 | `"plugins": ["react", "oxc"],` | Включает наборы правил react и oxc в линтере. Не путать с plugins Vite. |
| 4 | `"rules": {` | Начинает явные настройки правил проверки. |
| 5 | `"react/rules-of-hooks": "error",` | Нарушения правил вызова хуков считаются ошибкой проверки. |
| 6 | `"react/only-export-components": ["warn", { "allowConstantExport": true }]` | Предупреждение об экспортах для React Refresh; allowConstantExport допускает экспорт констант. Это шаблонная настройка. |
| 7 | `}` | Структурная скобка JSON: открывает/закрывает объект. Запятая отделяет соседние свойства, она не является содержимым строки. |
| 8 | `}` | Структурная скобка JSON: открывает/закрывает объект. Запятая отделяет соседние свойства, она не является содержимым строки. |

### Файл целиком: что происходит

Настройки статической проверки. Линтер следит за правилами React и экспортами. Проверка не заменяет тестирование пользовательского сценария.

## .gitignore

Происхождение: Автоматический файл шаблона Vite. Объясняем каждую строку, хотя она не написана вручную.

### Весь файл

```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### Каждая строка

| № | Строка | Объяснение |
| --- | --- | --- |
| 1 | `# Logs` | Комментарий обозначает группу исключений; сам путь не задаёт. |
| 2 | `logs` | Git исключает новые Папки logs с журналами. |
| 3 | `*.log` | Git исключает новые Файлы с расширением .log в любых подходящих каталогах. |
| 4 | `npm-debug.log*` | Исключает диагностические журналы пакетного менеджера. * означает любое продолжение имени. |
| 5 | `yarn-debug.log*` | Исключает диагностические журналы пакетного менеджера. * означает любое продолжение имени. |
| 6 | `yarn-error.log*` | Исключает диагностические журналы пакетного менеджера. * означает любое продолжение имени. |
| 7 | `pnpm-debug.log*` | Исключает диагностические журналы пакетного менеджера. * означает любое продолжение имени. |
| 8 | `lerna-debug.log*` | Исключает диагностические журналы пакетного менеджера. * означает любое продолжение имени. |
| 9 | (пустая строка) | Пустая строка отделяет группы шаблонов. |
| 10 | `node_modules` | Git исключает новые Скачанные зависимости npm: не коммитим, восстанавливаем npm install. |
| 11 | `dist` | Git исключает новые Результат сборки Vite: восстанавливается npm run build. |
| 12 | `dist-ssr` | Git исключает новые Возможная сборка для server-side rendering; в нашей реализации не используется. |
| 13 | `*.local` | Git исключает новые Локальные файлы конфигурации с суффиксом .local. |
| 14 | (пустая строка) | Пустая строка отделяет группы шаблонов. |
| 15 | `# Editor directories and files` | Комментарий обозначает группу исключений; сам путь не задаёт. |
| 16 | `.vscode/*` | Исключает содержимое папки настроек VS Code, кроме разрешённого следующей строкой файла. |
| 17 | `!.vscode/extensions.json` | Отменяет исключение для файла рекомендованных расширений VS Code. Знак ! - исключение из правила игнорирования. |
| 18 | `.idea` | Исключает настройки IDE JetBrains. |
| 19 | `.DS_Store` | Исключает служебные файлы macOS. |
| 20 | `*.suo` | Исключает служебные файлы редакторов/IDE по шаблону *.suo. Символ * обозначает любую последовательность, ? один символ; это не файлы приложения. |
| 21 | `*.ntvs*` | Исключает служебные файлы редакторов/IDE по шаблону *.ntvs*. Символ * обозначает любую последовательность, ? один символ; это не файлы приложения. |
| 22 | `*.njsproj` | Исключает служебные файлы редакторов/IDE по шаблону *.njsproj. Символ * обозначает любую последовательность, ? один символ; это не файлы приложения. |
| 23 | `*.sln` | Исключает служебные файлы редакторов/IDE по шаблону *.sln. Символ * обозначает любую последовательность, ? один символ; это не файлы приложения. |
| 24 | `*.sw?` | Исключает служебные файлы редакторов/IDE по шаблону *.sw?. Символ * обозначает любую последовательность, ? один символ; это не файлы приложения. |

### Файл целиком: что происходит

Шаблоны исключения новых файлов из индекса Git. Зависимости, сборка и настройки редакторов не должны засорять коммит.

## Разбор действий по шагам

### Добавление

1. Нажатие Button в BlockToolbar вызывает стрелочную функцию.
2. Она вызывает onAdd с heading или text.
3. В App prop связан с addBlock из хука.
4. Хук создаёт ID и объект. Updater строит новый массив.
5. React заново вычисляет App и передаёт массив редактору/предпросмотру.
6. map создаёт новое поле и соответствующий элемент страницы, счётчик увеличивается.

### Ввод одного символа

1. Браузер вызывает onChange поля.
2. event.target.value содержит целую новую строку, а не только введённый символ.
3. onUpdate получает ID и строку.
4. updateBlock с map возвращает новый объект только для нужного ID.
5. Общий массив обновляется. Поле получает новое value, предпросмотр новую строку.

### Удаление

1. Кнопка конкретного блока вызывает onDelete(block.id).
2. filter оставляет блоки с другими ID.
3. Стабильные key остальных блоков сохраняются.
4. При пустом результате показываются сообщения, а счётчик равен нулю.

## Что не разбирается как наш исходный код

- package-lock.json создаётся npm. Главные части: lockfileVersion - версия формата; packages - записи дерева; version - точная версия; resolved - источник загрузки; integrity - проверка содержимого пакета. Не редактировать вручную ради оформления.
- node_modules содержит чужие исходники, декларации типов и служебные файлы. Сотни файлов появляются автоматически. Удалённая папка восстанавливается npm install или npm ci при подходящем lock-файле.
- dist создаёт сборщик. Имена с хешами относятся к выходным ресурсам. Это не место для ручной правки компонентов.
- PNG бинарный: у него нет строк JavaScript. Его импорт и показ разобраны в App. Изображение было обработано imagegen, не вырезано ручным CSS.
- README и три гайда - документы. Их текст не запускает сайт. THIRD_PARTY_NOTICES содержит сторонний лицензирующий текст, не код редактора.
- Конфигурация .git содержит информацию Git, а не React. Не пытаться объяснять внутренности Git как часть архитектуры конструктора.

## Короткий словарь синтаксиса

`const` запрещает переприсваивание имени, но само по себе не делает объект неизменяемым. `function` объявляет функцию. `=>` - стрелочная функция. `===` и `!==` сравнивают без преобразования типов. `? :` выбирает одно из двух выражений. `...` означает rest или spread в зависимости от позиции. `{}` могут означать объект, тело функции или вставку выражения в JSX - смотри контекст. `[]` могут быть массивом, деструктуризацией или доступом по индексу. Круглые скобки - вызов, параметры или группировка выражения. import подключает экспорт модуля, export default делает один главный экспорт доступным извне.

## Как сверять гайд после изменений

Ниже количество строк и SHA-256 файлов, разобранных в этом снимке. Хеш нужен только для проверки, что код не изменился после создания гайда; это не требование лабораторной и не функция приложения.

| Файл | Строк | SHA-256 |
| --- | --- | --- |

| index.html | 12 | `5b4d96e038eb60bb53d8fd7e6ca95a090f5baea23d603d82375a8740e65c416f` |
| src/main.jsx | 11 | `cbfe7a0c54741a7920ef9d3b7200c7fb587e09f50b8c39cbaf1d371bcb8b9608` |
| src/App.jsx | 37 | `305cacc43dadeac448aa619f5640ceb80e019eb56c27fd1a7db33401a677f8a8` |
| src/hooks/usePageBlocks.js | 28 | `6c772b37b67a89be9db7eb2285224e2498bd9c59d956278e4537950a392d92c5` |
| src/shared/ui/Button.jsx | 9 | `82a35f3217eddeaee31f0b120172751b59a16be791c09d95bda3512fd6f4be71` |
| src/components/BlockToolbar.jsx | 16 | `aa3308037b97495f5b84a8ed9f3d5cca5d61e379ba55441a1b387c3911dd7510` |
| src/components/BlockEditor.jsx | 19 | `cd0c06ceb3c3b4f07ce0e37e1db274af679d093fa4116a198dfced60e6c4dc89` |
| src/components/PageEditor.jsx | 16 | `6f96a5f2c003589e1027135c3a21e620cffd9908d05c14e297036eb90b38b043` |
| src/components/PagePreview.jsx | 18 | `29e84869ce759284818af4127ecdb0d874840910b6fdf776c4d5bdce99a6372f` |
| vite.config.js | 12 | `783b3d84dfa14332f9de5360c763ad5e715eae9c1b9a92275e105ebbf6b6ed2b` |
| jsconfig.json | 6 | `130bdfc8b2806c76fa68301637dac3c20cab646fb8cb5eed0bd83bad2deb59e7` |
| src/index.css | 29 | `a97964aea9e3f53d35ef0c2e9fca1d2f39004b4c3276f43da42eee956f3cffbd` |
| src/App.css | 271 | `cd5b45fa6c86a8ea6b11498e664829ef1b62e22514fa42bd5266f5001caa6cd1` |
| package.json | 24 | `876891d5c327166d9af031f546d4a6945d3f19331a0ae0912c167779a87d0174` |
| .oxlintrc.json | 8 | `1be899e45c49b2a2edc715bc3bfb31d8ed8e866ed7ebab2065ff6e55e88c2396` |
| .gitignore | 24 | `fe718e7babb14f3cbad2d97f08889b9ce5215ed3fe0e43b2b8cfbfb3b9b844e8` |

Всего объяснено **540 строк**. Пустой src/data/services.js учтён отдельно и содержит 0 строк.
