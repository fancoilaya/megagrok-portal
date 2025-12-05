import Header from '../components/Header'
import RoadmapComic from '../components/RoadmapComic'

export default function TelegramRPG(){
  return (
    <div>
      <Header />
      <main className="container">
        <h2>Telegram RPG — How it works</h2>

        <div className="panel" style={{marginTop:12}}>
          <h3>Overview</h3>
          <p>The MegaGrok Telegram bot is a light RPG that tracks your Grok as it earns XP, fights mobs, and evolves. Weekly leaderboard snapshots determine the Top Grok who receives weekly airdrops (token or NFT).</p>
        </div>

        <div className="panel" style={{marginTop:12}}>
          <h3>Core Commands</h3>
          <ul>
            <li><strong>/growmygrok</strong> — Earn XP by completing activities.</li>
            <li><strong>/hop</strong> — Daily ritual bonus.</li>
            <li><strong>/fight &lt;mob&gt;</strong> — Battle mobs across tiers.</li>
            <li><strong>/profile</strong> — View your Grok profile.</li>
            <li><strong>/grokdex</strong> — Browse creatures.</li>
            <li><strong>/leaderboard</strong> — View weekly standings (used for airdrops).</li>
          </ul>
        </div>

        <RoadmapComic />

      </main>
    </div>
  )
}
