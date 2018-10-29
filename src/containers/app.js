import React, { Component } from 'react';
import styled from 'styled-components';

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
  render() {
    return (
      <AppPage>
        <h1>My App</h1>
      </AppPage>
    );
  }
}

export default App;
