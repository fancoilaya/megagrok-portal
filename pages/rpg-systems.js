import Header from '../components/Header'

export default function RPGSystems() {
  return (
    <div>
      <Header />

      <main className="container">
        <h2>MegaGrok RPG Systems</h2>
        <p>
          This page explains the inner mechanics of the MegaGrok RPG —
          how evolutions work, how battles are resolved, and how progression,
          protection, and rewards are calculated.
        </p>

        {/* ENTRY */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Getting Started — /awaken</h3>
          <p>
            The MegaGrok RPG is played through a single unified comic-style UI.
            The <strong>/awaken</strong> command launches the interface where
            you manage your Grok, enter battles, evolve, and compete.
          </p>
          <p>
            Once awakened, most actions happen inside the UI rather than
            through individual commands.
          </p>
        </div>

        {/* EVOLUTION OVERVIEW */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Evolution System — 7-Stage Ladder</h3>
          <p>
            Grok evolution is not cosmetic. Each evolution stage directly
            affects XP gain, combat effectiveness, and ritual bonuses.
          </p>

          <ol>
            <li><strong>Tadpole</strong> — Entry stage, baseline stats</li>
            <li><strong>Hopper</strong> — Increased XP gain and early bonuses</li>
            <li><strong>Battle Hopper</strong> — Combat-focused progression</li>
            <li><strong>Void Hopper</strong> — Advanced scaling and aura effects</li>
            <li><strong>Titan</strong> — Major combat and ritual bonuses</li>
            <li><strong>Celestial</strong> — High XP multipliers and presence</li>
            <li><strong>OmniGrok</strong> — Apex evolution with maximum bonuses</li>
          </ol>

          <p>
            Evolutions are unlocked automatically when your Grok reaches
            specific level thresholds. The system always resolves to the
            highest valid evolution for your level.
          </p>
        </div>

        {/* WHY EVOLUTION MATTERS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Why Evolution Matters</h3>
          <ul>
            <li><strong>XP Multiplier</strong> — Higher stages gain XP faster</li>
            <li><strong>Fight Bonus</strong> — Flat bonuses applied in combat</li>
            <li><strong>Ritual Bonus</strong> — Increased rewards from rituals</li>
            <li><strong>Visual Identity</strong> — Frames and auras change</li>
          </ul>
          <p>
            This ensures late-game Groks feel meaningfully more powerful
            without breaking balance.
          </p>
        </div>

        {/* COMBAT SYSTEM */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Combat System (Turn-Based)</h3>
          <p>
            Combat in MegaGrok is turn-based and resolved through the unified UI.
            Each turn, players choose an action. Outcomes are calculated
            server-side for fairness.
          </p>
        </div>

        {/* BATTLE ACTIONS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Battle Actions</h3>

          <p><strong>Attack</strong></p>
          <p>
            Deals damage based on your Grok’s stats, evolution bonuses,
            and situational modifiers. Damage is reduced if the opponent
            blocks or dodges.
          </p>

          <p><strong>Block</strong></p>
          <p>
            Reduces incoming damage for the turn. Effective against
            high-damage attacks but does not deal damage.
          </p>

          <p><strong>Dodge</strong></p>
          <p>
            Attempts to avoid damage entirely. Success depends on
            probabilities and matchup conditions.
          </p>

          <p><strong>Charge</strong></p>
          <p>
            Sacrifices immediate safety to increase the power of
            a future attack. Risk-reward action.
          </p>

          <p><strong>Heal</strong></p>
          <p>
            Restores HP instead of attacking. Healing is limited and
            cannot exceed maximum HP.
          </p>
        </div>

        {/* DAMAGE LOGIC */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>How Damage Is Calculated (High-Level)</h3>
          <p>
            Damage is calculated using a combination of:
          </p>
          <ul>
            <li>Base attack values</li>
            <li>Evolution fight bonuses</li>
            <li>Randomized variance</li>
            <li>Opponent defensive actions (block / dodge)</li>
          </ul>
          <p>
            This keeps combat unpredictable while still rewarding
            progression and smart decisions.
          </p>
        </div>

        {/* SHIELDS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>Shields & Protection</h3>
          <p>
            Shields protect Groks from being repeatedly targeted.
            After certain battles or actions, a Grok may receive
            temporary protection.
          </p>
          <ul>
            <li>Prevents farming weaker players</li>
            <li>Enforces cooldowns between attacks</li>
            <li>Maintains fair competitive pacing</li>
          </ul>
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
            Ranked by Arena performance. Represents competitive prestige.
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
