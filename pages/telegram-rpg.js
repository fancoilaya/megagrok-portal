import Header from "../components/Header";
import RoadmapComic from "../components/RoadmapComic";

export default function TelegramRPG(){
  return (
    <div>
      <Header />
      <main className="container">
        <h2>Telegram RPG — How it works</h2>

        <div className="panel" style={{marginTop:12}}>
          <h3>Overview</h3>
          <p>
            The MegaGrok Telegram bot is a light RPG that tracks your Grok as it earns XP,
            fights mobs, and evolves. The bot snapshots weekly leaderboards; the Top Grok
            receives a weekly airdrop. This page contains gameplay details and our roadmap.
          </p>
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
          <h3>Weekly Airdrops & Rewards</h3>
          <p>
            Each week the bot snapshots the leaderboard. The Top Grok receives a weekly airdrop
            (token or NFT). Additional rewards include OG roles, comic-panel appearances, and in-lore advantages.
            Rules and eligibility will be posted here and in the bot's pinned messages.
          </p>
        </div>

        {/* Roadmap section — comic-strip style */}
        <RoadmapComic />

        <div style={{marginTop:18}}>
          <a href="/" style={{color:'#ffd27a'}}>← Back to home</a>
        </div>
      </main>
    </div>
  );
}
