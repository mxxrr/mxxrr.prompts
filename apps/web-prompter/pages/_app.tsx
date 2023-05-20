import { AppProps } from 'next/app'
import Head from 'next/head'
import { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { createEmotionCache, lightTheme } from '@mxxrr/style'
import './styles.css'


const clientSideEmotionCache = createEmotionCache()

type Props = AppProps & {
  emotionCache: EmotionCache
}

const App = ({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: Props) => {

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <Head>
          <title>mxxrr | Prompter</title>
        </Head>
        <main>
          <Component {...pageProps} />
        </main>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default App
