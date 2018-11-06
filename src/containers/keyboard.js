import React, { Component } from 'react';
import styled from 'styled-components';
import Key from './key';

const Layout = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-gap: 15px;
`

class Keyboard extends Component {
  state = {
    keys: [
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';',
      'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
    ],
    context: window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext(),
  }

  render() {
    const { context } = this.state;
    return (
      <Layout>
        { this.state.keys.map((keycode, i) => <Key key={i} keycode={keycode} context={context} />) }
      </Layout>
    );
  }
}

export default Keyboard;
