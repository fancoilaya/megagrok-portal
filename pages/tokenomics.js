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
          <p>Note: This is a mock tokenomics section — consult your legal counsel for CA and compliance.</p>
        </div>
      </main>
    </div>
  )
}
