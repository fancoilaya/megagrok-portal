import Header from '../components/Header'

export default function Comics(){
  return (
    <div>
      <Header />
      <main className="container">
        <h2>Living Comic</h2>
        <p>Weekly comic pages shaped by community choices. Chapters will be published here as the story evolves.</p>

        <div className="panel" style={{marginTop:12}}>
          <h3>Latest Chapters</h3>
          <div>
            <article style={{marginTop:12}}>
              <h4>Chapter 1 — The Awakening</h4>
              <img src="/cover1.jpg" alt="Chapter 1" style={{maxWidth:'100%', borderRadius:6}}/>
              <p>Chapter excerpt: MegaGrok rises from the Pump Swamps... (sample text)</p>
            </article>
          </div>
        </div>

        <div className="panel" style={{marginTop:12}}>
          <h3>How the story works</h3>
          <p>At the end of each chapter the community will vote on a major choice that affects the next chapter. High-ranking players can unlock cameo appearances.</p>
        </div>

        <div style={{marginTop:18}}>
          <a href="/" style={{color:'#ffd27a'}}>← Back to home</a>
        </div>
      </main>
    </div>
  )
}
