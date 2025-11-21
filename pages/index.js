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
          <div className="panel">
            <h3>Telegram RPG</h3>
            <p>Integrates with the MegaGrok bot to track XP and evolutions.</p>
          </div>
          <div className="panel">
            <h3>Weekly Airdrops</h3>
            <p>Leaderboard snapshots determine token & NFT rewards.</p>
          </div>
          <div className="panel">
            <h3>Comic Universe</h3>
            <p>Living comic that the community directs each week.</p>
          </div>
          <div className="panel">
            <h3>Meme Coin</h3>
            <p>CA incoming — tokenomics, vesting, and airdrop schedule live on Tokenomics page.</p>
          </div>
        </section>
      </main>
    </div>
  )
}
