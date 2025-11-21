import Link from 'next/link'
export default function Header(){
  return (
    <header className="site-header container" style={{marginBottom:24}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <img src="/cover1.jpg" alt="MegaGrok" style={{height:64,width:64,objectFit:'cover',borderRadius:8,border:'3px solid #ff7a00'}}/>
        <div>
          <h1 style={{margin:0,fontSize:22,color:'#ffb14d',letterSpacing:2}}>MegaGrok Metaverse</h1>
          <div style={{fontSize:12,color:'#ffd7a8'}}>Cosmic Amphibian Universe</div>
        </div>
      </div>
      <nav>
        <Link href="/">Home</Link> | <Link href="/grokdex">GrokDex</Link> | <Link href="/leaderboard">Leaderboard</Link> | <Link href="/comics">Comics</Link> | <Link href="/tokenomics">Tokenomics</Link>
      </nav>
    </header>
  )
}
