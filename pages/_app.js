import '../styles/globals.css'
import Head from 'next/head'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <title>MegaGrok Metaverse</title>
      </Head>
      <Component {...pageProps} />
      <Footer />
    </>
  )
}
