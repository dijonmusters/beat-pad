import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import styled from 'styled-components';

const Keycap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
  width: 50px;
  height: 50px;
  background-color: ${props => props.hasSound && '#777'};
  background-color: ${props => props.isActive && 'rgba(200, 200, 200, 0.8)'};
`

class Key extends Component {
  state = {
    active: false,
    sound: null,
  }

  componentDidMount() {
    document.addEventListener('keydown', (e) => {
      const { keycode } = this.props;
      const { sound } = this.state;
      if (e.key === keycode) {
        sound && this.playSound();
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

  onDrop = (files) => {
    (files.length > 0) ? this.loadSound(files[0]) : console.error('inappropriate file type. audio only!');
  }

  onError() {
    console.error('there was an error loading audio file');
  }

  loadSound(file) {
    const { context } = this.props;
    const reader = new FileReader();
    reader.onload = () => {
      const bufferArray = reader.result;
      context.decodeAudioData(bufferArray, (buffer) => {
        this.setState({ sound: buffer, context });
      }, this.onError);
    }
    reader.readAsArrayBuffer(file);
  }

  playSound() {
    const { context } = this.props;
    const { sound } = this.state;
    const source = context.createBufferSource();
    source.buffer = sound;
    source.connect(context.destination);
    source.start(0);
  }

  render() {
    const { keycode } = this.props;
    const { active, sound } = this.state;
    const hasSound = (sound !== null);
    return (
      <Dropzone
        onDrop={this.onDrop}
        className="dropzone" // required to override default styling
        accept="audio/*"
      >
        <Keycap isActive={active} hasSound={hasSound}>{keycode}</Keycap>
      </Dropzone>
    );
  }
}

export default Key;
