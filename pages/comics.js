import Header from '../components/Header'

export default function Comics(){
  return (
    <div>
      <Header />
      <main className='container'>
        <h2>Living Comic</h2>
        <div className='panel' style={{marginTop:12}}>
          <h3>Latest Chapter</h3>
          <img src='/cover1.jpg' alt='cover' style={{maxWidth:'100%',borderRadius:6}} />
          <p>Community-driven adventures: vote to shape the next chapter.</p>
        </div>
      </main>
    </div>
  )
}
