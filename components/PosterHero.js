export default function PosterHero({ title='MEGAPUMP', subtitle='Join the MegaSquad — push the narrative' }){
  return (
    <div className='poster-hero' style={{overflow:'hidden'}}>
      <img src='/poster_megapush.png' alt='Poster' style={{display:'block',width:'100%',height:360,objectFit:'cover'}}/>
      <div style={{padding:16}}>
        <h3 style={{margin:0,color:'#ffd27a'}}>{title}</h3>
        <p style={{margin:0,color:'#ffe7b8'}}>{subtitle}</p>
      </div>
    </div>
  )
}
