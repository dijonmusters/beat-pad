import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import styled from 'styled-components';
import WaveformData from 'waveform-data';
import webAudioBuilder from 'waveform-data/webaudio';
import Modal from '../components/modal';

const Keycap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
  width: 50px;
  height: 50px;
  background-color: ${props => props.hasSound && '#777'};
  background-color: ${props => props.isActive && 'rgba(200, 200, 200, 0.8)'};
  cursor: pointer;
`

class Key extends Component {
  state = {
    active: false,
    sound: null,
    isModalVisible: false,
    options: {
      start: 150,
      isPlaying: false,
    },
    currentlyPlaying: [],
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
      webAudioBuilder(context, bufferArray, (err, waveformData) => {
        const waveform = WaveformData.create(bufferArray);

        const interpolateHeight = (total_height) => {
          const amplitude = 256;
          return (size) => total_height - ((size + 128) * total_height) / amplitude;
        };
        const canvas = document.getElementById('waveform');
        const y = interpolateHeight(canvas.height);
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = 'rgb(200, 0, 0)';
        // from 0 to 100
        waveform.min.forEach((val, x) => ctx.lineTo(x + 0.5, y(val) + 0.5));

        // then looping back from 100 to 0
        waveform.max.reverse().forEach((val, x) => {
          ctx.lineTo((waveform.offset_length - x) + 0.5, y(val) + 0.5);
        });

        // ctx.closePath();
        // ctx.fillStroke();
      });
      context.decodeAudioData(bufferArray, (buffer) => {
        const { options } = this.state;
        options.duration = buffer.duration;
        options.end = options.duration;
        this.setState({ sound: buffer, options });
      }, this.onError);
    }
    reader.readAsArrayBuffer(file);
  }

  handleStop = (event) => {
    const { currentlyPlaying } = this.state;
    const idx = currentlyPlaying.indexOf(event.target);
    currentlyPlaying.splice(idx, 1);
  }

  playSound() {
    const { context } = this.props;
    const { sound, options: { start, end }, currentlyPlaying } = this.state;
    const source = context.createBufferSource();
    source.buffer = sound;
    source.connect(context.destination);
    if (currentlyPlaying.length > 0) {
      currentlyPlaying[0].stop();
    }
    source.start(context.currentTime, start, end);
    currentlyPlaying.push(source);
    source.onended = this.handleStop;
  }

  showModal = (e) => {
    const { sound } = this.state;
    if (sound) {
      e.preventDefault();
      this.setState({ isModalVisible: true });
    }
  };

  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  handleClick = (e) => {
    console.log('clicked')
    console.log(e)
    e.preventDefault();
  }

  handleStartChange = (e) => {
    const { value } = e.target;
    const { options } = this.state;
    console.log(e.target.value);
    options.start = value;
    this.setState({ options });
  }

  handleEndChange = (e) => {
    const { value } = e.target;
    const { options } = this.state;
    console.log(e.target.value);
    options.end = value;
    this.setState({ options });
  }

  render() {
    const { keycode } = this.props;
    const { active, sound, options } = this.state;
    const hasSound = (sound !== null);
    return (
      <>
        <Dropzone
          onDrop={this.onDrop}
          className="dropzone" // required to override default styling
          accept="audio/*"
          onClick={this.showModal}
        >
          <Keycap isActive={active} hasSound={hasSound}>{keycode}</Keycap>
        </Dropzone>
        <Modal show={this.state.isModalVisible} handleClose={this.hideModal}>
          <canvas id="waveform" width="150" height="150"></canvas>
          <label htmlFor="startTime">Start</label>
          <input type="range" min="0" max={options.duration} value={options.start} id="startTime" onChange={this.handleStartChange} />
          <label htmlFor="endTime">End</label>
          <input type="range" min="0" max={options.duration} value={options.end} id="endTime" onChange={this.handleEndChange} />
        </Modal>
      </>
    );
  }
}

export default Key;
