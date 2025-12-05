import React from 'react';
const milestones = [
  { quarter: 'Phase 0', title: 'Foundations', bullets: ['Project pitch & community setup', 'Telegram bot basic commands', 'Initial art & brand'] },
  { quarter: 'Phase 1', title: 'Telegram RPG Launch', bullets: ['GrowMyGrok, Hop Ritual, Fight', 'GrokDex & profile cards', 'Weekly leaderboard snapshots'] },
  { quarter: 'Phase 2', title: 'Progression & Rewards', bullets: ['Evolutions: Tadpole → Hopper → Ascended', 'Weekly airdrops for Top Grok', 'Comic cameo unlocks'] },
  { quarter: 'Phase 3', title: 'Community & Boss Raids', bullets: ['Community-voted story choices', 'Boss raids & group events', 'NFT utility planning'] },
  { quarter: 'Phase 4', title: 'On-chain & MemeCoin', bullets: ['NFT drops & comic-panel minting', 'CA & tokenomics rollout', 'Seasonal resets + marketplace'] },
];
export default function RoadmapComic(){
  return (
    <div style={{marginTop:18, marginBottom:12}}>
      <div style={{marginBottom:10}}>
        <h3 style={{margin:0,fontSize:20,color:'#ffb470'}}>Roadmap — The Hop-Verse Plan</h3>
        <p style={{margin:0,color:'#ffdca8',fontSize:13}}>A comic-strip view of MegaGrok's upcoming milestones.</p>
      </div>
      <div className="roadmap-scroller" role="list">
        {milestones.map((m, i) => (
          <article key={i} className="roadmap-panel" style={{
            minWidth:320,
            maxWidth:360,
            borderRadius:12,
            border:'6px solid #ff7a00',
            background:'linear-gradient(180deg, rgba(26,10,45,0.95), rgba(10,6,22,0.85))',
            padding:16,
            boxShadow:'0 12px 48px rgba(255,106,0,0.12)',
            position:'relative',
            overflow:'hidden'
          }}>
            <div style={{paddingRight:12}}>
              <div style={{fontSize:12,fontWeight:800,color:'#ffdfb8'}}>{m.quarter}</div>
              <h4 style={{margin:'6px 0 8px',color:'#ffd27a'}}>{m.title}</h4>
              <ul style={{margin:0,paddingLeft:18,color:'#ffe8c0',fontSize:14}}>
                {m.bullets.map((b,idx)=> <li key={idx} style={{marginBottom:6}}>• {b}</li>)}
              </ul>
              <div style={{display:'flex',justifyContent:'flex-end',marginTop:10}}>
                <span style={{background:'#ff7a00',color:'#120418',padding:'6px 10px',borderRadius:8,fontWeight:800,fontSize:12}}>Coming</span>
              </div>
            </div>
            <div style={{
              position:'absolute',right:-16,bottom:-16,width:140,height:140,
              backgroundImage:"url('/poster_megapush.png')",backgroundSize:'cover',backgroundPosition:'center',opacity:0.08,transform:'rotate(12deg)'
            }} />
          </article>
        ))}
      </div>
    </div>
  );
}
