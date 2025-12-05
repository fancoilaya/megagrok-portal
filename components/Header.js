import Link from 'next/link'
export default function Header(){
  return (
    <header className="site-header container">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <img src="/cover1.jpg" alt="MegaGrok" style={{height:72,width:72,objectFit:'cover',borderRadius:10,border:'4px solid #ff7a00'}}/>
        <div>
          <div style={{fontSize:14,color:'#ffb14d',letterSpacing:2,fontWeight:800}}>MEGAGROK</div>
          <div style={{fontSize:12,color:'#ffd7a8'}}>Cosmic Amphibian Universe</div>
        </div>
      </div>
      <nav>
        <Link href="/"><a>Home</a></Link>
        <Link href="/megaforge"><a>MegaForge</a></Link>
        <Link href="/telegram-rpg"><a>Play</a></Link>
        <Link href="/grokdex"><a>GrokDex</a></Link>
        <Link href="/comics"><a>Comics</a></Link>
        <Link href="/roadmap"><a>Roadmap</a></Link>
        <Link href="/nfts"><a>NFTs</a></Link>
        <Link href="/tokenomics"><a>Token</a></Link>
      </nav>
    </header>
  )
}
