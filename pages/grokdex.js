import Header from '../components/Header'
export default function GrokDex({data}) {
  return (
    <div>
      <Header />
      <main className="container">
        <h2>GrokDex</h2>
        <p>Index of creatures (mock data from API)</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
          <div className="panel">
            <h4>Grok (Tadpole)</h4>
            <div>Type: Amphibian</div>
            <div>Rarity: Common</div>
          </div>
          <div className="panel">
            <h4>Hopper</h4>
            <div>Type: Amphibian</div>
            <div>Rarity: Rare</div>
          </div>
          <div className="panel">
            <h4>Ascended</h4>
            <div>Type: Cosmic</div>
            <div>Rarity: Legendary</div>
          </div>
        </div>
      </main>
    </div>
  )
}
