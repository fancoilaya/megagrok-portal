import Header from '../components/Header'

export default function RPGSystems() {
  return (
    <div>
      <Header />

      <main className="container">
        <h2>MegaGrok RPG Systems</h2>
        <p>
          This page explains how the MegaGrok RPG works under the hood —
          progression, combat, leaderboards, and rewards.
        </p>

        {/* ENTRY */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Getting Started — /awaken</h3>
          <p>
            The MegaGrok RPG is played through a unified comic-style UI.
            The <strong>/awaken</strong> command launches the interface where
            you control your Grok, fight, evolve, and compete.
          </p>
          <p>
            Once awakened, most gameplay happens inside the UI rather than
            through individual commands.
          </p>
        </div>

        {/* CORE COMMANDS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Core Commands</h3>
          <ul>
            <li><strong>/awaken</strong> — Launch the main RPG UI</li>
            <li><strong>/profile</strong> — View your Grok stats and progression</li>
            <li><strong>/grokdex</strong> — Browse creatures, mobs, and lore</li>
            <li><strong>/leaderboard</strong> — View rankings</li>
          </ul>
          <p>
            Combat, movement, and actions are primarily handled inside
            the UI after awakening.
          </p>
        </div>

        {/* EVOLUTION */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Evolution System</h3>
          <p>
            Your Grok evolves through three stages:
          </p>
          <ul>
            <li><strong>Tadpole</strong> — Early growth stage</li>
            <li><strong>Hopper</strong> — Mid-game power and speed</li>
            <li><strong>Ascended</strong> — High-tier cosmic evolution</li>
          </ul>
          <p>
            Evolutions are based on XP, activity, and progression milestones.
          </p>
        </div>

        {/* XP */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>XP & Progression</h3>
          <p>
            XP is earned by participating in the RPG:
          </p>
          <ul>
            <li>Fighting PvE mobs</li>
            <li>Winning Arena PvP battles</li>
            <li>Daily activity and rituals</li>
          </ul>
          <p>
            XP contributes directly to evolution progression and leaderboard ranking.
          </p>
        </div>

        {/* SHIELDS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Shields & Protection</h3>
          <p>
            Shields protect Groks from being repeatedly attacked.
          </p>
          <ul>
            <li>Automatic protection after certain actions</li>
            <li>Prevents farming or harassment</li>
            <li>Time-based cooldown before re-entry into combat</li>
          </ul>
          <p>
            Shield logic ensures fair play and balanced progression.
          </p>
        </div>

        {/* COMBAT */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Combat System</h3>
          <p>
            Combat is turn-based and rendered using the unified comic UI.
          </p>
          <ul>
            <li>Stats influence damage, defense, and outcomes</li>
            <li>Animated attacks and effects</li>
            <li>Clear win / loss resolution</li>
          </ul>
        </div>

        {/* PVE */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>PvE — Mobs & Tiers</h3>
          <p>
            PvE enemies are divided into tiers with increasing difficulty.
          </p>
          <ul>
            <li>Tier 1–2: Early and mid-game mobs</li>
            <li>Tier 3: Elite mobs</li>
            <li>Tier 4: Bosses (future)</li>
          </ul>
        </div>

        {/* PVP */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Arena PvP</h3>
          <p>
            Arena PvP uses the same unified UI and is turn-based.
          </p>
          <ul>
            <li>Turn-based Arena PvP — Live</li>
            <li>Live PvP battles — In development</li>
            <li>Seasonal PvP tournaments — Planned</li>
          </ul>
        </div>

        {/* LEADERBOARDS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Leaderboards</h3>
          <p>
            The RPG features two separate leaderboards:
          </p>
          <p>
            🧬 <strong>Evolution Leaderboard</strong><br />
            Based on XP and progression. Used for weekly airdrops.
          </p>
          <p>
            ⚔️ <strong>PvP Leaderboard</strong><br />
            Based on Arena performance. Represents competitive prestige.
          </p>
        </div>

        {/* AIRDROPS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Weekly Airdrops</h3>
          <p>
            Each week, the Evolution Leaderboard is snapshotted.
          </p>
          <p>
            The top Grok receives a weekly airdrop
            (token or NFT).
          </p>
        </div>

        <div style={{ marginTop: 18 }}>
          <a href="/telegram-rpg" style={{ color: '#ffd27a' }}>
            ← Back to Telegram RPG
          </a>
        </div>
      </main>
    </div>
  )
}
