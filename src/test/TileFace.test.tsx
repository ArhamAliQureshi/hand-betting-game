import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TileFaceUI } from '../ui/tiles/TileFace';
import { TILE_CATALOG } from '../engine/tiles';

describe('TileFaceUI', () => {
  it('renders all tile types produced by the catalog without crashing', () => {
    // TILE_CATALOG has 34 distinct faces
    for (const def of TILE_CATALOG) {
      const { container } = render(
        <TileFaceUI 
          tile={{ 
            id: 'test', 
            face: def.face, 
            suit: def.suit, 
            baseValue: def.baseValue, 
            isDynamic: def.isDynamic, 
            currentValue: def.baseValue 
          }} 
        />
      );
      
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      
      // Dynamic ones should render the badge
      if (def.isDynamic) {
        const badge = container.querySelector('.dynamic-badge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveTextContent(String(def.baseValue));
      }
    }
  });
});
