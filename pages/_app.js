import styled, { createGlobalStyle } from 'styled-components'
import { Normalize } from 'styled-normalize'
import { Provider as AudioContextProvider } from 'hooks/useAudioContext'
const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@100;200;300;400;500;600;700;800;900&display=swap');

  body {
    font-family: 'Libre Franklin', sans-serif;
  }
`

const Container = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
`

const MyApp = ({ Component, pageProps }) => (
  <>
    <Normalize />
    <GlobalStyles />
    <AudioContextProvider>
      <Container>
        <Component {...pageProps} />
      </Container>
    </AudioContextProvider>
  </>
)

export default MyApp
