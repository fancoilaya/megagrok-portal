import Header from '../components/Header'
export default function Comics(){
  return (
    <div>
      <Header />
      <main className="container">
        <h2>Living Comic</h2>
        <p>Weekly pages influenced by players — mock pages below.</p>
        <div className="panel" style={{marginTop:12}}>
          <h3>Chapter 1 — The Awakening</h3>
          <img src="/cover1.jpg" alt="cover" style={{maxWidth:'100%',borderRadius:6}}/>
          <p>Chapter excerpt: MegaGrok rises from the Pump Swamps...</p>
        </div>
      </main>
    </div>
  )
}
