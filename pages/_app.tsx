
import '../styles/globals.css'
import { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Ramadhan Kareem</title>
        <meta name="description" content="Ramadhan Kareem - Selamat Menunaikan Ibadah Puasa" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
