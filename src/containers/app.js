import React, { Component } from 'react';
import styled from 'styled-components';
import Keyboard from '../containers/keyboard';

const AppPage = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`

class App extends Component {
  componentDidMount() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
    }
    catch(e) {
      alert('Web Audio API is not supported in this browser');
    }
  }

  render() {
    return (
      <AppPage>
        <Keyboard />
      </AppPage>
    );
  }
}

export default App;
