import React from 'react';
import { useGameState } from '../../state/Store';
import { TileFaceUI } from '../tiles/TileFace';
import './ScoresPanel.css';

export const ScoresPanel: React.FC = () => {
  const { engineState } = useGameState();
  
  if (!engineState) return null;

  // Take the last 3 history snapshots
  const recentHistory = [...engineState.history].reverse().slice(0, 3);

  return (
    <div className="panel scores-panel" data-testid="scores-panel">
      <h2>Scores</h2>
      <div className="scores-list">
        {recentHistory.length === 0 ? (
          <p className="scores-empty">-</p>
        ) : (
          recentHistory.map((snapshot) => (
            <div key={snapshot.round} className="score-row">
              <div className="score-tiles">
                {snapshot.hand.slice(0, 3).map((tile, i) => (
                  <div key={i} style={{ transform: 'scale(0.8)', margin: '-4px' }}>
                    <TileFaceUI tile={tile} size="small" />
                  </div>
                ))}
                {snapshot.hand.length > 3 && <span className="score-ellipsis">...</span>}
              </div>
              <div className={`score-badge ${snapshot.outcome}`}>
                {snapshot.outcome === 'win' ? '+1' : '0'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
