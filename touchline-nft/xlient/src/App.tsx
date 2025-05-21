import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StarknetNFTInterface from './Deploy'
import { useGlobalContext } from './provider/GlobalContext'

function App() {
  

  return (
    <>
      <StarknetNFTInterface />
    </>
  )
}

export default App
