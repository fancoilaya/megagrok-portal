import Header from '../components/Header'

export default function NFTs(){
  return (
    <div>
      <Header />
      <main className="container">
        <h2>NFTs — Coming Soon</h2>
        <p>Planned drops: evolution collectibles, comic panels, and utility NFTs that boost airdrops and in-game perks.</p>

        <div className="panel" style={{marginTop:12}}>
          <h3>Utilities</h3>
          <ul>
            <li>In-game cosmetics</li>
            <li>Airdrop multipliers</li>
            <li>Comic cameo rights</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
