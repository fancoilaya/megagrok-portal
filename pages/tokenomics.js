import Header from '../components/Header'

export default function Tokenomics(){
  return (
    <div>
      <Header />
      <main className="container">
        <h2>Tokenomics & CA</h2>
        <div className="panel">
          <h3>MemeCoin (MEGROK)</h3>
          <ul>
            <li>Total supply: 1,000,000,000</li>
            <li>Team: 10% (vesting)</li>
            <li>Community & Airdrops: 30%</li>
            <li>Liquidity: 20%</li>
            <li>Reserve: 40%</li>
          </ul>
          <p>Note: This is a mock tokenomics section — consult legal counsel for CA and compliance. Exact CA date and contract will be posted here when ready.</p>
        </div>

        <div className="panel" style={{marginTop:12}}>
          <h3>Planned Utilities</h3>
          <ul>
            <li>Airdrops for leaderboard winners</li>
            <li>In-game purchases (cosmetics, shards)</li>
            <li>Governance & community treasury (future)</li>
          </ul>
        </div>

        <div style={{marginTop:18}}>
          <a href="/" style={{color:'#ffd27a'}}>← Back to home</a>
        </div>
      </main>
    </div>
  )
}
