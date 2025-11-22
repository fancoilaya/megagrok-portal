import Header from '../components/Header'
import Countdown from '../components/Countdown'
export default function Home(){
  // example target date for CA launch
  const caDate = new Date()
  caDate.setDate(caDate.getDate() + 14) // two weeks from now

  return (
    <div>
      <Header />
      <main className="container">
        <section className="hero panel" style={{marginBottom:24}}>
          <h2 style={{marginTop:0,fontSize:34}}>Welcome to the MegaGrok Metaverse</h2>
          <p style={{maxWidth:800}}>Grow your Grok via the Telegram RPG, battle, climb leaderboards, and influence the living comic.</p>
          <Countdown target={caDate.toISOString()} />
        </section>

        <section className="grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          <a href="/telegram-rpg" className="panel" style={{textDecoration:'none',color:'inherit'}}>
            <h3>Telegram RPG</h3>
            <p>Play the MegaGrok Telegram bot: GrowMyGrok, Hop Ritual, Fight, Evolutions, GrokDex, and leaderboard. Weekly leaderboard snapshots live in the bot — Top Grok receives a weekly airdrop.</p>
          </a>

          <div className="panel">
            <h3>NFTs (Coming Soon)</h3>
            <p>A cosmic NFT collection tied to Grok evolutions, comic panels, and lore collectibles — utility for holders to be announced.</p>
          </div>

          <a href="/comics" className="panel" style={{textDecoration:'none',color:'inherit'}}>
            <h3>Comic Universe</h3>
            <p>Living comic that the community directs each week — updated pages, chapter list, and community votes.</p>
          </a>

          <div className="panel">
            <h3>Meme Coin</h3>
            <p>CA incoming — the MEMECOIN will power the MegaGrok economy. Contract Announcement (CA) coming soon.</p>
          </div>

          <a href="/tokenomics" className="panel" style={{gridColumn:'1 / -1', textDecoration:'none', color:'inherit'}}>
            <h3>Tokenomics</h3>
            <p>Explore MEMECOIN supply, distribution, utility, and airdrop mechanics. CA timeline and governance details will be posted here.</p>
          </a>
        </section>
      </main>
    </div>
  )
}
