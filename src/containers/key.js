import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import styled from 'styled-components';
import drawBuffer from 'draw-wave';
// import WaveformData from 'waveform-data';
// import webAudioBuilder from 'waveform-data/webaudio';
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
    this.drawWaveform();
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

  componentDidUpdate() {
    this.drawWaveform();
  }

  onDrop = (files) => {
    (files.length > 0) ? this.loadSound(files[0]) : console.error('inappropriate file type. audio only!');
  }

  onError() {
    console.error('there was an error loading audio file');
  }

  drawWaveform = () => {
    const { sound } = this.state;
    const canvas = document.getElementById('waveform');
    sound && canvas && drawBuffer.canvas(canvas, sound, '#52F6A4');
    // const { sound, analyser, bufferArray } = this.state;
    // const drawVisual = requestAnimationFrame(this.drawWaveform);
    // analyser.fftSize = 2048;
    // var bufferLength = analyser.frequencyBinCount;
    // var dataArray = new Uint8Array(bufferLength);
    // analyser.getByteTimeDomainData(dataArray);
    // const canvas = document.getElementById('waveform');
    // const canvasCtx = canvas.getContext("2d");
    // const WIDTH = 300;
    // const HEIGHT = 300;
    // const bufferLength = sound.length;
    // context.fillStyle = 'rgb(200, 200, 200)';
    // canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    // canvasCtx.lineWidth = 2;
    // canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    // canvasCtx.beginPath();
    // var sliceWidth = WIDTH * 1.0 / bufferLength;
    // var x = 0;
    // for(var i = 0; i < bufferLength; i++) {
    //   var v = sound[i] / 128.0;
    //   var y = v * HEIGHT/2;

    //   if(i === 0) {
    //     canvasCtx.moveTo(x, y);
    //   } else {
    //     canvasCtx.lineTo(x, y);
    //   }

    //   x += sliceWidth;
    //   canvasCtx.lineTo(canvas.width, canvas.height/2);
    //   canvasCtx.stroke();
    // var data = buffer.getChannelData( 0 );
    // var step = Math.ceil( data.length / width );
    // var amp = height / 2;
    // context.beginPath();
    // for(let i = 0; i < width; i++){
    //   let min = 1.0;
    //   let max = -1.0;
    //   for (let j = 0; j < step; j++) {
    //     const datum = data[(i*step)+j];
    //     if (datum < min)
    //       min = datum;
    //     if (datum > max)
    //       max = datum;
    //   }
    //   context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
    // }
    // context.closePath();
    // context.stroke()
    // debugger;
    // const canvas = document.getElementById('waveform');
    // const ctx = canvas.getContext('2d');
    // const { sound } = this.state;
    // var i, n = sound.length;
    // var dur = (n / 44100 * 1000)>>0;
    // canvas.title = 'Duration: ' +  dur / 1000.0 + 's';

    // const { width, height } = canvas;
    // ctx.strokeStyle = 'yellow';
    // ctx.fillStyle = '#303030';
    // ctx.fillRect(0, 0, width, height);
    // ctx.beginPath();
    // ctx.moveTo(0, height / 2);
    // let x, y;
    // for (i=0; i<n; i++)
    // {
    //     x = ( (i*width) / n);
    //     y = ((sound[i]*height/2)+height/2);
    //     ctx.lineTo(x, y);
    // }
    // ctx.stroke();
    // ctx.closePath();
    // canvas.mBuffer = samples;
  }

  loadSound(file) {
    const { context } = this.props;
    const reader = new FileReader();
    reader.onload = () => {
      const bufferArray = reader.result;
      context.decodeAudioData(bufferArray, (buffer) => {
        const { options } = this.state;
        options.duration = buffer.duration;
        options.end = options.duration;
        // const analyser = context.createAnalyser();
        // const source = context.createMediaStreamSource(bufferArray);
        // source.connect(analyser);
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
          <canvas id="waveform" width="750" height="200"></canvas>
          <label htmlFor="startTime">Start</label>
          <input type="range" min="0" max={options.duration} value={options.start} id="startTime" onChange={this.handleStartChange} />
          <label htmlFor="endTime">End</label>
          <input type="range" min="0" max={options.duration} value={options.end} id="endTime" onChange={this.handleEndChange} />
        </Modal>
        {/* {this.drawWaveform()} */}
      </>
    );
  }
}

export default Key;
