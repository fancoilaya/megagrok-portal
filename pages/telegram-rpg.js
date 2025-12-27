import Header from '../components/Header'
import RoadmapComic from '../components/RoadmapComic'

export default function TelegramRPG(){
  return (
    <div>
      <Header />

      <main className="container">
        <h2>Telegram RPG</h2>

        {/* OVERVIEW */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>One UI to Rule Them All</h3>
          <p>
            The MegaGrok RPG is played entirely through a unified comic-style UI.
            The <strong>/awaken</strong> command launches the interface where you
            manage your Grok, fight, evolve, and compete — all from one place.
          </p>
          <p>
            No command juggling. No menus. Just the MegaGrok experience.
          </p>
        </div>

        {/* GAME LOOP */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>The Core Game Loop</h3>
          <p>
            Awaken your Grok, earn XP, battle mobs, evolve through stages, and
            climb the rankings. Everything you do feeds into long-term progression
            and competition.
          </p>
          <ul>
            <li>🐸 Evolve your Grok: Tadpole → Hopper → Ascended</li>
            <li>⚔️ Fight PvE mobs across multiple tiers</li>
            <li>🏆 Compete on leaderboards</li>
            <li>🎨 Unlock lore, cosmetics, and future utility</li>
          </ul>
        </div>

        {/* LEADERBOARDS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Two Leaderboards</h3>

          <p>
            The RPG features <strong>two separate leaderboards</strong>,
            each serving a different purpose.
          </p>

          <p>
            🧬 <strong>Evolution Leaderboard</strong><br />
            Based on XP, progression, and evolutions.
            This leaderboard is used for <strong>weekly airdrops</strong>.
            Each week, the top Grok receives a reward (token or NFT).
          </p>

          <p>
            ⚔️ <strong>PvP Leaderboard</strong><br />
            Based on Arena PvP performance and ranking.
            This leaderboard represents competitive prestige and dominance.
            Rewards expand over time.
          </p>
        </div>

        {/* PVP */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Arena PvP</h3>
          <p>
            Arena PvP is turn-based and uses the same unified UI as the rest of the game.
            Strategy, stats, and timing matter.
          </p>
          <ul>
            <li>✅ Arena PvP</li>
            <li>🚧 Live PvP Battles (Turn-Based)  — In Development</li>
            <li>🗓️ Seasonal PvP Tournaments — Planned</li>
          </ul>
        </div>

        {/* REWARDS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Weekly Airdrops & Rewards</h3>
          <p>
            Each week, the Evolution Leaderboard is snapshotted.
            The top Grok receives a <strong>weekly airdrop</strong>
            (token or NFT).
          </p>
          <p>
            Additional rewards include OG roles, comic appearances,
            and future in-game advantages.
          </p>
        </div>

        {/* ROADMAP */}
        <RoadmapComic />

        <div style={{ marginTop: 18 }}>
          <a href="/" style={{ color: '#ffd27a' }}>← Back to home</a>
        </div>
      </main>
    </div>
  )
}
