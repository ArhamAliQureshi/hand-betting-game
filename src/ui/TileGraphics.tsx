import React from 'react';

// --- Colors ---
const COLORS = {
  green: '#008800', // Bamboo Green
  blue: '#0000AA', // Character Blue/Dark
  red: '#CC0000', // Dragon Red
  black: '#000000',
};

// --- Helpers ---
// Common character mapping for "Wan" (Characters) and Winds/Dragons
// We can use actual characters with a specific font style to simulate the tile look.
// Or we can use basic SVG paths if desired. For Characters/Winds, text is usually sufficient & cleaner if using a standard KaiTi/SongTi font.
// However, for Bamboo/Circles, we need shapes.

export const CircleGraphic: React.FC<{ value: number }> = ({ value }) => {
  // Dot positions tailored for standard Mahjong patterns
  const renderDots = () => {
    const dot = (cx: number, cy: number, color: string, r = 16) => (
      <circle cx={cx} cy={cy} r={r} fill={color} stroke="none" />
    );

    const red = COLORS.red;
    const green = COLORS.green;
    const blue = COLORS.blue;

    switch (value) {
      case 1: // Large red pancake/flower
        return (
          <g>
             <circle cx="50" cy="50" r="35" fill="none" stroke={red} strokeWidth="4" />
             <circle cx="50" cy="50" r="10" fill={red} />
             {/* Decorative pattern for 1-dot usually complex, simplified here */}
             <circle cx="50" cy="50" r="25" fill={red} opacity="0.2" />
          </g>
        );
      case 2: // Top/Bottom green
        return <>{dot(50, 25, green)}{dot(50, 75, blue)}</>; // Usually green/blue in various sets, simplified to green/blue
      case 3: // Diagonal
        return <>{dot(20, 20, blue)}{dot(50, 50, red)}{dot(80, 80, green)}</>;
      case 4: // Square
        return <>{dot(30, 30, blue)}{dot(70, 30, green)}{dot(30, 70, green)}{dot(70, 70, blue)}</>;
      case 5: // X shape
        return <>{dot(20, 20, blue)}{dot(80, 20, green)}{dot(50, 50, red)}{dot(20, 80, green)}{dot(80, 80, blue)}</>;
      case 6: // 2 rows (Green top, Red bottom usually)
        return (
          <>
            {dot(30, 25, green)}{dot(70, 25, green)}
            {dot(30, 50, red)}{dot(70, 50, red)}
            {dot(30, 75, red)}{dot(70, 75, red)}
          </>
        );
      case 7: // Diag 3 + Square 4 or similar. Usually 3 green diagonal top-left, 2 bottom.
        // Standard: 3 slanted green top, 4 red bottom rectangle
        return (
          <>
             {dot(20, 25, green, 12)}{dot(50, 35, green, 12)}{dot(80, 45, green, 12)}
             {dot(30, 65, red, 12)}{dot(70, 65, red, 12)}
             {dot(30, 85, red, 12)}{dot(70, 85, red, 12)}
          </>
        );
      case 8: // 4 top blue, 4 bottom blue
        return (
            <>
                {dot(30, 20, blue, 12)}{dot(70, 20, blue, 12)}
                {dot(30, 40, blue, 12)}{dot(70, 40, blue, 12)}
                {dot(30, 60, blue, 12)}{dot(70, 60, blue, 12)}
                {dot(30, 80, blue, 12)}{dot(70, 80, blue, 12)}
            </>
        );
      case 9: // 3 rows of 3
        return (
            <>
                 {dot(25, 20, green, 12)}{dot(50, 20, green, 12)}{dot(75, 20, green, 12)}
                 {dot(25, 50, red, 12)}{dot(50, 50, red, 12)}{dot(75, 50, red, 12)}
                 {dot(25, 80, blue, 12)}{dot(50, 80, blue, 12)}{dot(75, 80, blue, 12)}
            </>
        );
      default: return null;
    }
  };

  return (
    <svg viewBox="0 0 100 100" className="tile-graphic tile-graphic-circle">
      {renderDots()}
    </svg>
  );
};

export const BambooGraphic: React.FC<{ value: number }> = ({ value }) => {
  const stick = (x: number, y: number, color: string = COLORS.green, vertical = true) => (
     <rect x={x} y={y} width={vertical ? 8 : 20} height={vertical ? 25 : 6} rx="2" fill={color} />
  );
  const red = COLORS.red;
  const green = COLORS.green;
  const blue = COLORS.blue;

  const renderBamboos = () => {
    if (value === 1) {
        // The Bird! Simplified peacock/sparrow.
        return (
            <g transform="translate(50,55) scale(0.6)">
                <path d="M0,-50 Q30,-70 50,-20 Q50,20 0,50 Q-50,20 -50,-20 Q-30,-70 0,-50" fill={COLORS.green} />
                <circle cx="0" cy="-30" r="10" fill={COLORS.red} />
                <path d="M0,0 L20,30 L-20,30 Z" fill={COLORS.blue} />
            </g>
        );
    }
    
    // Pattern logic
    switch (value) {
        case 2: return <>{stick(46, 20, green)}{stick(46, 55, blue)}</>;
        case 3: return <>{stick(46, 55, green)}{stick(26, 25, blue)}{stick(66, 25, green)}</>; // 1 bottom, 2 top? usually 1 top 2 bot.
        // Standard: 1 vertical top, 2 vertical bottom
        // Fixing logic:
        // 2: top/bottom vertical
        // 3: 1 top, 2 bottom
        // 4: 2 top, 2 bottom
        // 5: 2 top, 1 center, 2 bottom
        // 6: 2 top, 2 mid, 2 bot (all small)
        // 7: 2 top (red), 3 bot (green)?? check pattern. 
        // 8: "M" shape top, "W" shape bottom? slant.
        // 9: 3 by 3
        
        // Simplified Sticks for MVP:
        case 3: return <>{stick(46, 15, blue)}{stick(26, 55, green)}{stick(66, 55, green)}</>;
        case 4: return <>{stick(26, 15, blue)}{stick(66, 15, green)}{stick(26, 55, green)}{stick(66, 55, blue)}</>;
        case 5: return <>{stick(26, 15, green)}{stick(66, 15, blue)}{stick(46, 35, red)}{stick(26, 55, blue)}{stick(66, 55, green)}</>;
        case 6: return <>{stick(26, 15, green)}{stick(46, 15, green)}{stick(66, 15, green)} {stick(26, 55, blue)}{stick(46, 55, blue)}{stick(66, 55, blue)}</>;
        case 7: return <>{stick(46, 15, red)}{stick(26, 40, green)}{stick(66, 40, green)}{stick(26, 65, green)}{stick(66, 65, green)}</>; // Approximation
        case 8: // Slanted
            return (
                <g>
                   <path d="M20,20 L40,10 L45,15 L25,25 Z" fill={green} />
                   <path d="M80,20 L60,10 L55,15 L75,25 Z" fill={green} />
                   
                   <path d="M20,40 L40,30 L45,35 L25,45 Z" fill={blue} />
                   <path d="M80,40 L60,30 L55,35 L75,45 Z" fill={blue} />
                   
                    <path d="M20,60 L40,50 L45,55 L25,65 Z" fill={green} />
                   <path d="M80,60 L60,50 L55,55 L75,65 Z" fill={green} />
                   
                   <path d="M20,80 L40,70 L45,75 L25,85 Z" fill={blue} />
                   <path d="M80,80 L60,70 L55,75 L75,85 Z" fill={blue} />
                </g>
            );
        case 9: return <>{stick(20, 15, red)}{stick(46, 15, blue)}{stick(72, 15, green)}  {stick(20, 40, red)}{stick(46, 40, blue)}{stick(72, 40, green)} {stick(20, 65, red)}{stick(46, 65, blue)}{stick(72, 65, green)}</>
        default: return null;
    }
  };

  return (
    <svg viewBox="0 0 100 100" className="tile-graphic tile-graphic-bamboo">
      {renderBamboos()}
    </svg>
  );
};

export const CharacterGraphic: React.FC<{ value: number }> = ({ value }) => {
  // Use Chinese characters.
  const numbers = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const wan = '萬';

  return (
    <div className="tile-graphic-character">
      <div className="char-number" style={{ color: COLORS.blue }}>{numbers[value]}</div>
      <div className="char-wan" style={{ color: COLORS.red }}>{wan}</div>
    </div>
  );
};

export const HonorGraphic: React.FC<{ kind: 'dragon' | 'wind', value: string | number }> = ({ kind, value }) => {
  let char = '';
  let color = COLORS.black;

  if (kind === 'dragon') {
      if (value === 'red') { char = '中'; color = COLORS.red; }
      if (value === 'green') { char = '發'; color = COLORS.green; }
      if (value === 'white') { char = 'KB'; color = COLORS.blue; } // "Kong Ban" - usually a frame or blank.
  } else {
      // Wind
      if (value === 'east') char = '東';
      if (value === 'south') char = '南';
      if (value === 'west') char = '西';
      if (value === 'north') char = '北';
      // Winds are usually Black or Blue.
  }

  if (kind === 'dragon' && value === 'white') {
     return (
         <svg viewBox="0 0 100 100" className="tile-graphic-block">
             <rect x="15" y="10" width="70" height="80" fill="none" stroke={COLORS.blue} strokeWidth="4" rx="4" />
         </svg>
     );
  }

  return (
      <div className="tile-graphic-honor" style={{ color }}>
          {char}
      </div>
  );
};
