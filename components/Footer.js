export default function Footer(){
  return (
    <footer className="site-footer container">
      <div>© {new Date().getFullYear()} MegaGrok — All rights reserved</div>
      <div>
        <a href="https://t.me/megagrok" target="_blank" rel="noreferrer">Telegram</a> · <a href="https://twitter.com" target="_blank" rel="noreferrer">X</a>
      </div>
    </footer>
  )
}
