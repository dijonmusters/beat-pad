import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone'
import useAudioContext from 'hooks/useAudioContext'

const Keycap = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;

  background-color: ${(props) =>
    props.isActive
      ? 'rgba(200, 200, 200, 0.8)'
      : props.hasSound
      ? 'rgba(200, 200, 200, 0.2)'
      : 'transparent'};
`

const Key = ({ keycode }) => {
  const [isActive, setIsActive] = useState(false)
  const [sound, setSound] = useState(null)
  const { audioContext } = useAudioContext()

  const playSound = () => {
    const source = audioContext.createBufferSource()
    source.buffer = sound
    source.connect(audioContext.destination)
    source.start(0)
  }

  const handleKeyDown = (e) => {
    if (e.key === keycode) {
      playSound()
      setIsActive(true)
    }
  }

  const handleKeyUp = (e) => {
    if (e.key === keycode) {
      setIsActive(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keydown', handleKeyUp)
    }
  })

  const loadSound = async (file) => {
    const blob = new Blob([file])
    const content = await blob.arrayBuffer()
    audioContext.decodeAudioData(
      content,
      (buffer) => {
        setSound(buffer)
      },
      () => {
        console.error('there was an error loading audio file')
      }
    )
  }

  const onDrop = (files) => {
    files.length > 0
      ? loadSound(files[0])
      : console.error('inappropriate file type. audio only!')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Keycap isActive={isActive} hasSound={!!sound}>
        {isDragActive ? '!' : keycode}
      </Keycap>
    </div>
  )
}

export default Key
