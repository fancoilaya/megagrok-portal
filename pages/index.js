import Header from '../components/Header'
import Countdown from '../components/Countdown'
import PosterHero from '../components/PosterHero'

export default function Home(){
  const caDate = new Date()
  caDate.setDate(caDate.getDate() + 21) // example CA date

  return (
    <div>
      <Header />
      <main className="container">
        <section className="hero" style={{padding:28}}>
          <h1>Welcome to the MegaGrok Metaverse</h1>
          <p>Grow your Grok, join the MegaSquad, influence the comic, and prepare for the $MegaGrok launch.</p>
          <div style={{marginTop:16}}>
            <a href="/telegram-rpg" className="cta-primary">Start Playing →</a>
            <a href="https://t.me/megagrok" className="cta-secondary" target="_blank" rel="noreferrer">Join Telegram</a>
          </div>
          <div style={{marginTop:12, fontSize:18, fontWeight:700, color:'#ffd27a'}}>CA Coming Soon</div>
        </section>

        <section style={{marginTop:18}}>
          <div className="grid-two">
            <a className="panel" href="/telegram-rpg" style={{textDecoration:'none',color:'inherit'}}>
              <h3>Telegram RPG</h3>
              <p>Play the MegaGrok bot: GrowMyGrok, Hop Ritual, Fight, Evolutions, GrokDex, and leaderboard — weekly airdrops for Top Grok.</p>
            </a>

            <a className="panel" href="/megaforge" style={{textDecoration:'none',color:'inherit'}}>
              <h3>MegaForge</h3>
              <p>Generate posters, art and campaign assets. Free and VIP tiers available.</p>
            </a>

            <a className="panel" href="/comics" style={{textDecoration:'none',color:'inherit'}}>
              <h3>Comic Universe</h3>
              <p>Read the living comic and vote on story choices each week.</p>
            </a>

            <a className="panel" href="/nfts" style={{textDecoration:'none',color:'inherit'}}>
              <h3>NFTs (Coming Soon)</h3>
              <p>Mint comic panels and evolution-driven collectibles with utility for holders.</p>
            </a>

            <a className="panel col-span-2" href="/tokenomics" style={{textDecoration:'none',color:'inherit'}}>
              <h3>$MegaGrok Token</h3>
              <p>Tokenomics, CA countdown, and integration with the RPG economy.</p>
            </a>
          </div>
        </section>

        <section style={{marginTop:28}}>
          <PosterHero title='MEGAPUMP' subtitle='Join the MegaSquad — push the narrative' />
        </section>

      </main>
    </div>
  )
}
