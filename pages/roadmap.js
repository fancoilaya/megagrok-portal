import Header from "../components/Header";
import RoadmapComic from "../components/RoadmapComic";

export default function RoadmapPage(){
  return (
    <div>
      <Header />
      <main className="container">
        <h2>Roadmap</h2>
        <p>Follow our journey — the roadmap below shows milestones and planned features.</p>

        <div className="panel" style={{marginTop:12}}>
          <RoadmapComic />
        </div>

        <div style={{marginTop:18}}>
          <a href="/" style={{color:'#ffd27a'}}>← Back to home</a>
        </div>
      </main>
    </div>
  );
}
