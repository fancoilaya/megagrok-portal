import Header from '../components/Header'

export default function RPGSystems(){
  return (
    <div>
      <Header />
      <main className="container">
        <h2>MegaGrok RPG Systems</h2>
        <p>Evolution system, mob tiers, battle UI, and GrokDex — all explained.</p>

        <section style={{marginTop:18}} className="panel">
          <h3>Evolution System</h3>
          <p>Tadpole → Hopper → Ascended. Evolutions require XP, fights, and rituals.</p>
        </section>

        <section style={{marginTop:18}} className="panel">
          <h3>Mob Tier System</h3>
          <p>25+ mobs across Tier 1–4. Bosses planned for raid events.</p>
        </section>

        <section style={{marginTop:18}} className="panel">
          <h3>Battle UI</h3>
          <p>Comic-style animated battles rendered as GIFs in Telegram.</p>
        </section>

        <section style={{marginTop:18}} className="panel">
          <h3>GrokDex</h3>
          <p>Encyclopedia of creatures with stats, rarity, and lore.</p>
        </section>
      </main>
    </div>
  )
}
