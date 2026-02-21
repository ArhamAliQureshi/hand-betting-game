import React from 'react';
import clsx from 'clsx';
import { Tile } from '../../engine/types';
import './TileFace.css';

interface Props {
  tile: Tile;
  size?: 'large' | 'small';
}

const CHINESE_NUMERALS: Record<number, string> = {
  1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九',
};

function renderCharacter(value: number) {
  return (
    <svg viewBox="0 0 100 140" className="tile-svg characters">
      <text x="50" y="45" fontSize="36" textAnchor="middle" fill="#CC1122" fontFamily="sans-serif">{CHINESE_NUMERALS[value]}</text>
      <text x="50" y="105" fontSize="48" textAnchor="middle" fill="#1122AA" fontFamily="sans-serif">萬</text>
    </svg>
  );
}

function renderDot(value: number) {
  const dots = [];
  const coords = [];
  
  if (value === 1) coords.push([50, 70]);
  else if (value === 2) coords.push([50, 35], [50, 105]);
  else if (value === 3) coords.push([25, 25], [50, 70], [75, 115]);
  else if (value === 4) coords.push([30, 30], [70, 30], [30, 110], [70, 110]);
  else if (value === 5) coords.push([30, 30], [70, 30], [50, 70], [30, 110], [70, 110]);
  else if (value === 6) coords.push([30, 25], [70, 25], [30, 70], [70, 70], [30, 115], [70, 115]);
  else if (value === 7) coords.push([20, 20], [50, 45], [80, 70], [30, 115], [70, 115], [30, 90], [70, 90]);
  else if (value === 8) coords.push([30, 20], [70, 20], [30, 50], [70, 50], [30, 90], [70, 90], [30, 120], [70, 120]);
  else if (value === 9) coords.push([25, 20], [50, 20], [75, 20], [25, 70], [50, 70], [75, 70], [25, 120], [50, 120], [75, 120]);

  for (let i = 0; i < coords.length; i++) {
    dots.push(<circle key={i} cx={coords[i][0]} cy={coords[i][1]} r={value > 5 ? 12 : 16} fill={i % 2 === 0 ? "#1122AA" : "#CC1122"} />);
  }

  return (
    <svg viewBox="0 0 100 140" className="tile-svg dots">
      {dots}
    </svg>
  );
}

function renderBamboo(value: number) {
  if (value === 1) {
    // Bird for 1 Bamboo
    return (
      <svg viewBox="0 0 100 140" className="tile-svg bamboo-bird">
        <circle cx="50" cy="70" r="30" fill="transparent" stroke="#11AA33" strokeWidth="4" />
        <path d="M 40 60 Q 50 40 60 60 Q 80 70 60 80 Q 50 100 40 80 Q 20 70 40 60" fill="#CC1122" />
        <circle cx="45" cy="55" r="3" fill="#000" />
      </svg>
    );
  }

  const sticks = [];
  const coords = [];
  
  if (value === 2) coords.push([50, 40], [50, 100]);
  else if (value === 3) coords.push([50, 30], [30, 110], [70, 110]);
  else if (value === 4) coords.push([30, 40], [70, 40], [30, 100], [70, 100]);
  else if (value === 5) coords.push([30, 30], [70, 30], [50, 70], [30, 110], [70, 110]);
  else if (value === 6) coords.push([30, 25], [70, 25], [30, 70], [70, 70], [30, 115], [70, 115]);
  else if (value === 7) coords.push([50, 25], [30, 70], [70, 70], [30, 115], [70, 115], [30, 50], [70, 50]); // adjusted roughly
  else if (value === 8) coords.push([30, 20], [70, 20], [30, 50], [70, 50], [30, 90], [70, 90], [30, 120], [70, 120]);
  else if (value === 9) coords.push([25, 20], [50, 20], [75, 20], [25, 70], [50, 70], [75, 70], [25, 120], [50, 120], [75, 120]);

  for (let i = 0; i < coords.length; i++) {
    sticks.push(
      <rect key={i} x={coords[i][0] - 6} y={coords[i][1] - 16} width="12" height="32" rx="4" fill="#11AA33" />
    );
  }

  return (
    <svg viewBox="0 0 100 140" className="tile-svg bamboo">
      {sticks}
    </svg>
  );
}

function renderHonor(face: string) {
  let symbol = '';
  let color = '#333';

  switch (face) {
    case 'East': symbol = '東'; color = '#1122AA'; break;
    case 'South': symbol = '南'; color = '#1122AA'; break;
    case 'West': symbol = '西'; color = '#1122AA'; break;
    case 'North': symbol = '北'; color = '#1122AA'; break;
    case 'Red': symbol = '中'; color = '#CC1122'; break;
    case 'Green': symbol = '發'; color = '#11AA33'; break;
    case 'White':
      return (
        <svg viewBox="0 0 100 140" className="tile-svg honor">
          <rect x="20" y="30" width="60" height="80" fill="transparent" stroke="#1122AA" strokeWidth="8" rx="8" />
        </svg>
      );
  }

  return (
    <svg viewBox="0 0 100 140" className="tile-svg honor">
      <text x="50" y="85" fontSize="56" textAnchor="middle" fill={color} fontFamily="sans-serif" fontWeight="bold">
        {symbol}
      </text>
    </svg>
  );
}

export const TileFaceUI: React.FC<Props> = ({ tile, size = 'large' }) => {
  return (
    <div className={clsx('mahjong-tile', size)} data-testid={`tile-${tile.id}`}>
      <div className="tile-surface">
        {tile.suit === 'Wan' && renderCharacter(tile.baseValue)}
        {tile.suit === 'Pin' && renderDot(tile.baseValue)}
        {tile.suit === 'Sou' && renderBamboo(tile.baseValue)}
        {(tile.suit === 'Wind' || tile.suit === 'Dragon') && renderHonor(tile.face)}
      </div>

      <div className="dynamic-badge" data-testid={`tile-badge-${tile.id}`}>
        {tile.currentValue}
      </div>
    </div>
  );
};
