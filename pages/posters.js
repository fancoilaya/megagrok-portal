import Header from '../components/Header'
import PosterHero from '../components/PosterHero'

export default function Posters(){
  return (
    <div>
      <Header />
      <main className='container'>
        <h2>Posters & Campaign Art</h2>
        <p>Download promotional posters and campaign banners.</p>
        <div style={{marginTop:12}}>
          <PosterHero title='MEGABULLISH' subtitle='$M — MegaGrok to the moon' />
        </div>
      </main>
    </div>
  )
}
