export default function Footer(){
  return (
    <footer className="site-footer container">
      <div>© {new Date().getFullYear()} MegaGrok — All rights reserved</div>
      <div>
        <a href="https://t.me/MegaGrokBot" target="_blank" rel="noreferrer">Telegram Bot</a> · <a href="/tokenomics">Tokenomics</a>
      </div>
    </footer>
  )
}
