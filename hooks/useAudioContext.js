import React, { createContext, useState, useEffect, useContext } from 'react'

const Context = createContext()

const Provider = ({ children }) => {
  const [audioContext, setAudioContext] = useState(null)

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    setAudioContext(new AudioContext())
  }, [])

  const exposed = {
    audioContext,
  }

  return <Context.Provider value={exposed}>{children}</Context.Provider>
}

const useDarkMode = () => useContext(Context)

export { useDarkMode as default, Provider }
