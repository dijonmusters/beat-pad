import styled from 'styled-components'
import Key from 'components/Key'
import keys from 'utils/keys.json'

const Keyboard = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-gap: 1rem;
  font-size: 2rem;
`

const IndexPage = () => (
  <Keyboard>
    {keys.map((keycode) => (
      <Key key={keycode} keycode={keycode} />
    ))}
  </Keyboard>
)

export default IndexPage

// TODO add name of audio track under keycode - truncate if too long
// TODO make outer container dynamicly size - keyboard is just 100vw
// TODO add waveforms
