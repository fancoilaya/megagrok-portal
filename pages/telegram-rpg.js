import Header from '../components/Header'

export default function TelegramRPG(){
  return (
    <div>
      <Header />
      <main className="container">
        <h2>Telegram RPG — How it works</h2>

        <div className="panel" style={{marginTop:12}}>
          <h3>Overview</h3>
          <p>The MegaGrok Telegram bot is a light RPG that tracks your Grok as it earns XP, fights mobs, and evolves. The bot stores weekly leaderboard snapshots that determine in-game rewards and weekly airdrops for the Top Grok.</p>
        </div>

        <div className="panel" style={{marginTop:12}}>
          <h3>Core Commands</h3>
          <ul>
            <li><strong>/growmygrok</strong> — Earn XP by completing activities and rituals.</li>
            <li><strong>/hop</strong> — Daily Hop Ritual (gives a daily boost and animation).</li>
            <li><strong>/fight &lt;mob&gt;</strong> — Battle mobs (FUDling, DoomHopper, BearOgre, FomoBeast, HopGoblin).</li>
            <li><strong>/profile</strong> — View your Grok stats and comic-style profile card.</li>
            <li><strong>/grokdex</strong> — Browse the GrokDex (encyclopedia of creatures).</li>
            <li><strong>/leaderboard</strong> — View weekly standings.</li>
          </ul>
        </div>

        <div className="panel" style={{marginTop:12}}>
          <h3>Progression & Evolutions</h3>
          <p>Groks evolve through tiers: Tadpole → Hopper → Ascended. XP unlocks evolutions and cosmetic rewards. Certain milestones unlock comic cameos and NFT eligibility (future).</p>
        </div>

        <div className="panel" style={{marginTop:12}}>
          <h3>Weekly Airdrops & Rewards</h3>
          <p>Each week the bot snapshots the leaderboard. The Top Grok receives a weekly airdrop (token or NFT). Additional rewards include OG roles, comic-panel appearances, and in-lore advantages. Rules and eligibility will be posted here and in the bot’s pinned messages.</p>
        </div>

        <div className="panel" style={{marginTop:12}}>
          <h3>Tips & Best Practices</h3>
          <ul>
            <li>Do the Hop Ritual daily to compound XP gains.</li>
            <li>Join group events and boss raids for bonus XP.</li>
            <li>Link your profile and follow rules for airdrop eligibility.</li>
          </ul>
        </div>

        <div style={{marginTop:18}}>
          <a href="/" style={{color:'#ffd27a'}}>← Back to home</a>
        </div>
      </main>
    </div>
  )
}
