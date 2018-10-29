import React, { Component } from 'react';
import styled from 'styled-components';

const Keycap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
  width: 50px;
  height: 50px;
  background-color: ${props => props.isActive ? 'rgba(200, 200, 200, 0.8)' : '' };
`

class Key extends Component {
  state = {
    active: false,
  }

  componentDidMount() {
    document.addEventListener('keydown', (e) => {
      const { keycode } = this.props;
      if (e.key === keycode) {
        this.setState({ active: true });
      }
    });
    document.addEventListener('keyup', (e) => {
      const { keycode } = this.props;
      if (e.key === keycode) {
        this.setState({ active: false });
      }
    });
  }

  render() {
    const { keycode } = this.props;
    const { active } = this.state;
    return (
        <Keycap isActive={active}>{keycode}</Keycap>
    );
  }
}

export default Key;
