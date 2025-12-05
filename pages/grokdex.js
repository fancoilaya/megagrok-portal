import Header from '../components/Header'

const sample = [
  {id:1,name:'Grok (Tadpole)',tier:1,rarity:'Common',hp:20},
  {id:2,name:'HopGoblin',tier:2,rarity:'Rare',hp:60},
  {id:3,name:'Ascended',tier:3,rarity:'Legendary',hp:200},
]

export default function GrokDex(){
  return (
    <div>
      <Header />
      <main className='container'>
        <h2>GrokDex</h2>
        <div className='grid-three' style={{marginTop:12}}>
          {sample.map(s => (
            <div key={s.id} className='panel'>
              <h4>{s.name}</h4>
              <div>Tier: {s.tier} • {s.rarity}</div>
              <div>HP: {s.hp}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
