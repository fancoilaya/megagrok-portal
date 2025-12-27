import Header from '../components/Header'
import PosterHero from '../components/PosterHero'

export default function Home(){
  return (
    <div>
      <Header />

      <main className="container">
        {/* HERO */}
        <section className="hero" style={{ padding: 28 }}>
          <h1>Welcome to the MegaGrok Metaverse</h1>

          <p>
            Grow your Grok, climb the Evolution Leaderboard, dominate Arena PvP,
            influence a living comic, and prepare for the <strong>$MegaGrok</strong> launch.
          </p>

          <div style={{ marginTop: 16 }}>
            <a href="/telegram-rpg" className="cta-primary">
              Start Playing →
            </a>
            <a
              href="https://t.me/megagrok"
              className="cta-secondary"
              target="_blank"
              rel="noreferrer"
            >
              Join Telegram
            </a>
          </div>

          {/* CA STATUS */}
          <div style={{ marginTop: 12, fontWeight: 700 }}>
            CA Coming Soon
          </div>
        </section>

        {/* CORE SECTIONS */}
        <section style={{ marginTop: 18 }}>
          <div className="grid-two">
            <a
              className="panel"
              href="/telegram-rpg"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <h3>Telegram RPG</h3>
              <p>
                Play the MegaGrok RPG with one unified comic-style UI.
                Evolve your Grok, fight mobs, enter the Arena, and climb two leaderboards.
              </p>
              <p>
                <strong>Weekly airdrops</strong> are awarded to the top Grok on the
                <strong> Evolution Leaderboard</strong>.
              </p>
            </a>

            <a
              className="panel"
              href="/megaforge"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <h3>MegaForge</h3>
              <p>
                The official MegaGrok poster engine. Generate comic-style campaign
                art with Free and VIP access.
              </p>
            </a>

            <a
              className="panel"
              href="/comics"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <h3>Comic Universe</h3>
              <p>
                A living comic shaped by the community. Top players and Arena legends
                can earn appearances in the story.
              </p>
            </a>

            <a
              className="panel"
              href="/nfts"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <h3>NFTs (Coming Soon)</h3>
              <p>
                NFTs tied to Grok evolutions, comics, MegaForge perks,
                and future in-game utility.
              </p>
            </a>

            <a
              className="panel col-span-2"
              href="/tokenomics"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <h3>$MegaGrok Token</h3>
              <p>
                The ecosystem token powering weekly airdrops, NFTs,
                and future utility across the MegaGrok Metaverse.
              </p>
            </a>
          </div>
        </section>

        {/* PROMO POSTER */}
        <section style={{ marginTop: 28 }}>
          <PosterHero
            title="MEGAPUMP"
            subtitle="Join the MegaSquad — push the narrative"
          />
        </section>
      </main>
    </div>
  )
}
