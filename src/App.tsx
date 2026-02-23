import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Gameplay } from './pages/Gameplay';
import { GameProvider } from './state/Store';
import { MotionConfig } from 'framer-motion';
import { BackgroundLayer } from './ui/background/BackgroundLayer';
import { Analytics } from '@vercel/analytics/react';

export const App: React.FC = () => {
  return (
    <div className="app-container">
      <BackgroundLayer />
      <div className="frame-container" data-testid="game-frame">
        <GameProvider>
          <MotionConfig reducedMotion="user">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/game" element={<Gameplay />} />
              </Routes>
            </BrowserRouter>
          </MotionConfig>
        </GameProvider>
      </div>
      <Analytics />
    </div>
  );
};

export default App;
