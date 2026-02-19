import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { GamePage } from './pages/GamePage'
import { GameProvider } from './state/context'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  )
}

export default App
