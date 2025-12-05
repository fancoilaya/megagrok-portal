import Header from '../components/Header'
import RoadmapComic from '../components/RoadmapComic'

export default function RoadmapPage(){
  return (
    <div>
      <Header />
      <main className='container'>
        <h2>Roadmap</h2>
        <div className='panel' style={{marginTop:12}}>
          <RoadmapComic />
        </div>
      </main>
    </div>
  )
}
