import Header from '../components/Header'

/**
 * GrokDex — Website Reference
 * Mirrors the canonical mobs.py database (read-only).
 * This page is informational and reflects the live RPG logic.
 */

const GROKDEX = [
  {
    tier: 1,
    title: 'Tier 1 — Common Creatures',
    description:
      'Early encounters designed for new and evolving Groks. Low combat power, basic mechanics.',
    mobs: [
      'FUDling',
      'HopGoblin',
      'Croakling',
      'RugRat',
      'HopSlime',
    ],
  },
  {
    tier: 2,
    title: 'Tier 2 — Uncommon Threats',
    description:
      'Stronger mobs that introduce advanced mechanics and higher damage output.',
    mobs: [
      'DoomHopper',
      'LiquiDrip',
      'PanicPuff',
      'GreedImp',
      'FUDSprite',
    ],
  },
  {
    tier: 3,
    title: 'Tier 3 — Rare Elites',
    description:
      'Elite enemies with higher HP pools and punishing abilities.',
    mobs: [
      'BearOgre',
      'BullSerpent',
      'CandleWraith',
      'FearHound',
      'RugFiend',
    ],
  },
  {
    tier: 4,
    title: 'Tier 4 — Epic Enemies',
    description:
      'High-risk encounters requiring evolved Groks and smart play.',
    mobs: [
      'FomoBeast',
      'LiquidatorAlpha',
      'RektTitan',
      'HopReaver',
      'OraclePhantom',
    ],
  },
  {
    tier: 5,
    title: 'Tier 5 — Legendary Bosses',
    description:
      'World-tier threats. Legendary encounters with massive combat power.',
    mobs: [
      'Hopocalypse',
      'RugnarokPrime',
      'ChartShatterDragon',
      'MegaFOMOTitan',
      'LiquidityLeviathan',
    ],
  },
]

export default function GrokDex() {
  return (
    <div>
      <Header />

      <main className="container">
        <h2>GrokDex</h2>
        <p>
          The GrokDex is the official creature encyclopedia of the MegaGrok RPG.
          It catalogs all known mobs and bosses exactly as they exist in the game.
        </p>

        {/* HOW IT WORKS */}
        <div className="panel" style={{ marginTop: 12 }}>
          <h3>How the GrokDex Works</h3>
          <p>
            In the Telegram RPG, the GrokDex is accessed from the unified UI.
            Players browse mobs by <strong>tier</strong>, then inspect individual
            creatures to learn their strengths, weaknesses, and rewards.
          </p>
          <p>
            This website version mirrors that structure as a reference guide.
          </p>
        </div>

        {/* TIERS */}
        {GROKDEX.map(tier => (
          <div key={tier.tier} className="panel" style={{ marginTop: 16 }}>
            <h3>{tier.title}</h3>
            <p>{tier.description}</p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 12,
                marginTop: 12,
              }}
            >
              {tier.mobs.map((mob, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: '2px solid #ff7a00',
                    background: 'rgba(18,6,40,0.9)',
                  }}
                >
                  <strong>{mob}</strong>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    Tier {tier.tier}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>
                    Rarity: {tier.tier === 5 ? 'Legendary' : tier.title.split('—')[1].trim()}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                    Combat stats are auto-generated in-game based on combat power.
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* STAT NOTE */}
        <div className="panel" style={{ marginTop: 18 }}>
          <h3>Combat Stats & Scaling</h3>
          <p>
            Mob stats such as HP, attack, defense, crit chance, and dodge chance
            are automatically calculated in the RPG based on combat power.
          </p>
          <p>
            This allows consistent difficulty scaling while keeping encounters
            unpredictable.
          </p>
        </div>

        {/* FUTURE */}
        <div className="panel" style={{ marginTop: 18 }}>
          <h3>Future Expansion</h3>
          <p>
            New mobs, bosses, and realms will expand the GrokDex over time.
            This page will eventually sync directly with the live RPG backend.
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
