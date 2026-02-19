import type { TileDefinition, TileId, TileSnapshot } from './types';

/**
 * Calculates the total value of a hand based on current dynamic values.
 * - Number tiles: Face value.
 * - Legend/Wind tiles: Value from dynamicMap (default 5).
 */
export const calculateHandTotal = (
  tiles: TileDefinition[],
  dynamicValues: Map<TileId, number>
): number => {
  return tiles.reduce((sum, tile) => {
    let value = tile.baseValue;

    if (tile.kind === 'dragon' || tile.kind === 'wind') {
      value = dynamicValues.get(tile.id) ?? tile.baseValue;
    }

    return sum + value;
  }, 0);
};

/**
 * Creates an immutable snapshot of the hand for history.
 * Captures the value of each tile at this specific moment.
 */
export const createHandSnapshot = (
  tiles: TileDefinition[],
  dynamicValues: Map<TileId, number>
): TileSnapshot[] => {
  return tiles.map((tile) => {
    let value = tile.baseValue;
    if (tile.kind === 'dragon' || tile.kind === 'wind') {
      value = dynamicValues.get(tile.id) ?? tile.baseValue;
    }

    return {
      id: tile.id,
      kind: tile.kind,
      face: tile.face,
      suit: tile.suit,
      baseValue: tile.baseValue,
      valueAtThatTime: value,
    };
  });
};
