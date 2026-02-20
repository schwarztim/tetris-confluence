import { PieceType, Color, RotationState } from './types';

export const COLS = 10;
export const ROWS = 20;
export const CELL_SIZE = 30;

export const COLORS: Record<PieceType, Color> = {
  I: '#00f5ff',
  O: '#ffdd00',
  T: '#bf00ff',
  S: '#00ff00',
  Z: '#ff0000',
  J: '#0000ff',
  L: '#ff8800'
};

export const EMPTY_CELL = '#1a1a2e';

export const SCORING = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800
};

export const LEVEL_SPEED: Record<number, number> = {
  1: 1000,
  2: 900,
  3: 800,
  4: 700,
  5: 600,
  6: 500,
  7: 400,
  8: 300,
  9: 200,
  10: 180,
  11: 160,
  12: 140,
  13: 120,
  14: 100,
  15: 80,
  16: 60,
  17: 50,
  18: 40,
  19: 30,
  20: 20
};

export const LINES_PER_LEVEL = 10;

export const INITIAL_LEVEL = 1;

export const SPAWN_X: Record<PieceType, number> = {
  I: 3,
  O: 4,
  T: 3,
  S: 3,
  Z: 3,
  J: 3,
  L: 3
};

export const SPAWN_Y: Record<PieceType, number> = {
  I: -2,
  O: -1,
  T: -1,
  S: -1,
  Z: -1,
  J: -1,
  L: -1
};

export const WALL_KICK_DATA: Record<PieceType, Record<RotationState, { x: number; y: number }[]>> = {
  I: {
    0: [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 1 }, { x: 1, y: -2 }],
    1: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: -2 }, { x: 2, y: 1 }],
    2: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: -1 }, { x: -1, y: 2 }],
    3: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 2 }, { x: -2, y: -1 }]
  },
  O: {
    0: [{ x: 0, y: 0 }],
    1: [{ x: 0, y: 0 }],
    2: [{ x: 0, y: 0 }],
    3: [{ x: 0, y: 0 }]
  },
  T: {
    0: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }],
    1: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: -1, y: 0 }],
    2: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }],
    3: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 0 }]
  },
  S: {
    0: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }],
    1: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: -1, y: 0 }],
    2: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }],
    3: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 0 }]
  },
  Z: {
    0: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }],
    1: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: -1, y: 0 }],
    2: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }],
    3: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 0 }]
  },
  J: {
    0: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }],
    1: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: -1, y: 0 }],
    2: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }],
    3: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 0 }]
  },
  L: {
    0: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }],
    1: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: -1, y: 0 }],
    2: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }],
    3: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 0 }]
  }
};
