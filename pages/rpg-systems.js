import Header from '../components/Header'

export default function RPGSystems() {
  return (
    <div>
      <Header />

      <main className="container">
        <h2>MegaGrok RPG Systems</h2>
        <p>
          This page explains how the MegaGrok RPG works under the hood —
          progression, evolutions, combat logic, protection systems,
          leaderboards, and rewards.
        </p>

        {/* ENTRY */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Getting Started — /awaken</h3>
          <p>
            The MegaGrok RPG is played through a single unified comic-style UI.
            The <strong>/awaken</strong> command launches the interface where you
            control your Grok, enter battles, evolve, and compete.
          </p>
          <p>
            Once awakened, nearly all gameplay happens inside the UI rather
            than through individual commands.
          </p>
        </div>

        {/* EVOLUTION SYSTEM */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Evolution System — 7-Step Progression</h3>
          <p>
            Evolution is a core progression mechanic. Each evolution step
            provides meaningful bonuses and visual changes.
          </p>

          <ol>
            <li><strong>Tadpole</strong> — Baseline stats, early progression</li>
            <li><strong>Hopper</strong> — Increased XP efficiency</li>
            <li><strong>Battle Hopper</strong> — Combat-focused bonuses</li>
            <li><strong>Void Hopper</strong> — Advanced scaling and aura effects</li>
            <li><strong>Titan</strong> — Major combat and ritual bonuses</li>
            <li><strong>Celestial</strong> — High XP multipliers and presence</li>
            <li><strong>OmniGrok</strong> — Apex evolution with maximum bonuses</li>
          </ol>

          <p>
            Evolutions unlock automatically when level thresholds are reached.
            The system always resolves to the highest valid evolution.
          </p>
        </div>

        {/* VISUAL EVOLUTION LADDER */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Evolution Ladder (Visual)</h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
              marginTop: 12,
            }}
          >
            {[
              'Tadpole',
              'Hopper',
              'Battle Hopper',
              'Void Hopper',
              'Titan',
              'Celestial',
              'OmniGrok',
            ].map((stage, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: 'center',
                  padding: '12px 6px',
                  borderRadius: 10,
                  border: '2px solid #ff7a00',
                  background: 'rgba(18,6,40,0.9)',
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {stage}
                <div style={{ fontSize: 11, opacity: 0.8, marginTop: 4 }}>
                  Stage {idx + 1}
                </div>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 12 }}>
            Each step increases XP gain, combat effectiveness,
            and visual prestige.
          </p>
        </div>

        {/* WHY EVOLUTION MATTERS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Why Evolution Matters</h3>
          <ul>
            <li><strong>XP Multipliers</strong> — Higher stages level faster</li>
            <li><strong>Fight Bonuses</strong> — Flat bonuses in combat</li>
            <li><strong>Ritual Bonuses</strong> — Improved ritual rewards</li>
            <li><strong>Visual Identity</strong> — Frames, auras, presence</li>
          </ul>
        </div>

        {/* COMBAT SYSTEM */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Combat System (Turn-Based)</h3>
          <p>
            All combat in MegaGrok is turn-based and resolved server-side.
            Each turn, players select an action, and outcomes are calculated
            fairly and consistently.
          </p>
        </div>

        {/* BATTLE ACTIONS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Battle Actions</h3>

          <p><strong>Attack</strong></p>
          <p>
            Deals damage based on base stats, evolution bonuses,
            and randomized variance. Damage is reduced if the opponent
            blocks or successfully dodges.
          </p>

          <p><strong>Block</strong></p>
          <p>
            Reduces incoming damage for the turn. Effective against
            high-damage attacks but does not deal damage.
          </p>

          <p><strong>Dodge</strong></p>
          <p>
            Attempts to avoid incoming damage entirely.
            Success depends on probabilities and matchup conditions.
          </p>

          <p><strong>Charge</strong></p>
          <p>
            Sacrifices defense for the turn to power up a future attack.
            High risk, high reward.
          </p>

          <p><strong>Heal</strong></p>
          <p>
            Restores HP instead of attacking. Healing is limited
            and cannot exceed maximum HP.
          </p>
        </div>

        {/* DAMAGE LOGIC */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>How Damage Is Calculated (High-Level)</h3>
          <ul>
            <li>Base attack values</li>
            <li>Evolution fight bonuses</li>
            <li>Randomized variance</li>
            <li>Opponent defensive actions</li>
          </ul>
          <p>
            This keeps combat unpredictable while rewarding
            progression and smart decision-making.
          </p>
        </div>

        {/* SHIELDS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Shields & Protection</h3>
          <p>
            Shields prevent repeated targeting and farming.
            After certain actions or battles, Groks receive
            temporary protection.
          </p>
          <ul>
            <li>Prevents repeated attacks</li>
            <li>Enforces cooldowns</li>
            <li>Ensures fair competition</li>
          </ul>
        </div>

        {/* PVE */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>PvE — Mob Tiers</h3>
          <ul>
            <li>Tier 1–2: Early & mid-game mobs</li>
            <li>Tier 3: Elite mobs</li>
            <li>Tier 4: Boss encounters (planned)</li>
          </ul>
        </div>

        {/* PVP */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Arena PvP</h3>
          <ul>
            <li>Turn-Based Arena PvP — Live</li>
            <li>Live PvP Battles — In Development</li>
            <li>Seasonal PvP Tournaments — Planned</li>
          </ul>
        </div>

        {/* PVP ELO */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>PvP Ranking & ELO</h3>
          <p>
            Arena PvP uses an ELO-based ranking system to measure
            competitive skill.
          </p>
          <ul>
            <li>Defeating stronger opponents increases ELO more</li>
            <li>Losing to weaker opponents decreases ELO more</li>
            <li>Close matches cause smaller rating changes</li>
          </ul>
          <p>
            ELO affects PvP leaderboard placement and tournament seeding,
            not weekly airdrops.
          </p>
        </div>

        {/* LEADERBOARDS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Leaderboards</h3>
          <p>
            🧬 <strong>Evolution Leaderboard</strong><br />
            Ranked by XP and progression. Used for weekly airdrops.
          </p>
          <p>
            ⚔️ <strong>PvP Leaderboard</strong><br />
            Ranked by Arena performance and ELO. Prestige-focused.
          </p>
        </div>

        {/* AIRDROPS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Weekly Airdrops</h3>
          <p>
            Each week, the Evolution Leaderboard is snapshotted.
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
