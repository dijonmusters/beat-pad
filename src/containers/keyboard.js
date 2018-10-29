import React, { Component } from 'react';
import styled from 'styled-components';

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
  }
  render() {
    return (
      <Layout>
        { this.state.keys.map((keycode, i) => <p key={i}>{keycode}</p>) }
      </Layout>
    );
  }
}

export default Keyboard;
