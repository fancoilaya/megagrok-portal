import Header from '../components/Header'
import PosterHero from '../components/PosterHero'

export default function MegaForge(){
  return (
    <div>
      <Header />
      <main className="container">
        <h2>MegaForge — Poster & Asset Engine</h2>
        <p>MegaForge creates campaign art and posters for the MegaGrok Metaverse. Choose Free or VIP mode.</p>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginTop:18}}>
          <div className="panel">
            <h3>Free Mode</h3>
            <p>Access a limited set of templates, standard resolutions, and community presets.</p>
          </div>
          <div className="panel">
            <h3>VIP Mode</h3>
            <p>High-res, exclusive templates, priority rendering, custom prompts and early access.</p>
          </div>
        </div>

        <section style={{marginTop:20}}>
          <PosterHero title='MEGAPUSH' subtitle='Generate campaign art in your signature style' />
        </section>

      </main>
    </div>
  )
}
