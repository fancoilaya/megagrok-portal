import Header from '../components/Header'

export default function Tokenomics(){
  return (
    <div>
      <Header />
      <main className='container'>
        <h2>$MegaGrok Token</h2>
        <div className='panel' style={{marginTop:12}}>
          <h3>Tokenomics (draft)</h3>
          <ul>
            <li>Total supply: 1,000,000,000</li>
            <li>Team: 10% (vesting)</li>
            <li>Community & Airdrops: 30%</li>
            <li>Liquidity: 20%</li>
            <li>Reserve: 40%</li>
          </ul>
          <p>Top leaderboard players receive weekly airdrops tied to the Telegram bot.</p>
        </div>
      </main>
    </div>
  )
}
