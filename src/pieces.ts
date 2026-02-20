import { PieceType, RotationState } from './types';
import { COLORS } from './constants';

export type PieceShape = boolean[][];

export const PIECE_SHAPES: Record<PieceType, Record<RotationState, PieceShape>> = {
  I: {
    0: [
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, false]
    ],
    1: [
      [false, false, true, false],
      [false, false, true, false],
      [false, false, true, false],
      [false, false, true, false]
    ],
    2: [
      [false, false, false, false],
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false]
    ],
    3: [
      [false, true, false, false],
      [false, true, false, false],
      [false, true, false, false],
      [false, true, false, false]
    ]
  },
  O: {
    0: [
      [true, true],
      [true, true]
    ],
    1: [
      [true, true],
      [true, true]
    ],
    2: [
      [true, true],
      [true, true]
    ],
    3: [
      [true, true],
      [true, true]
    ]
  },
  T: {
    0: [
      [false, true, false],
      [true, true, true],
      [false, false, false]
    ],
    1: [
      [false, true, false],
      [false, true, true],
      [false, true, false]
    ],
    2: [
      [false, false, false],
      [true, true, true],
      [false, true, false]
    ],
    3: [
      [false, true, false],
      [true, true, false],
      [false, true, false]
    ]
  },
  S: {
    0: [
      [false, true, true],
      [true, true, false],
      [false, false, false]
    ],
    1: [
      [false, true, false],
      [false, true, true],
      [false, false, true]
    ],
    2: [
      [false, false, false],
      [false, true, true],
      [true, true, false]
    ],
    3: [
      [true, false, false],
      [true, true, false],
      [false, true, false]
    ]
  },
  Z: {
    0: [
      [true, true, false],
      [false, true, true],
      [false, false, false]
    ],
    1: [
      [false, false, true],
      [false, true, true],
      [false, true, false]
    ],
    2: [
      [false, false, false],
      [true, true, false],
      [false, true, true]
    ],
    3: [
      [false, true, false],
      [true, true, false],
      [true, false, false]
    ]
  },
  J: {
    0: [
      [true, false, false],
      [true, true, true],
      [false, false, false]
    ],
    1: [
      [false, true, false],
      [false, true, false],
      [true, true, false]
    ],
    2: [
      [false, false, false],
      [true, true, true],
      [false, false, true]
    ],
    3: [
      [false, true, true],
      [false, true, false],
      [false, true, false]
    ]
  },
  L: {
    0: [
      [false, false, true],
      [true, true, true],
      [false, false, false]
    ],
    1: [
      [true, true, false],
      [false, true, false],
      [false, true, false]
    ],
    2: [
      [false, false, false],
      [true, true, true],
      [true, false, false]
    ],
    3: [
      [false, true, false],
      [false, true, false],
      [false, true, true]
    ]
  }
};

export function getPieceShape(type: PieceType, rotation: RotationState): PieceShape {
  return PIECE_SHAPES[type][rotation];
}

export function getPieceColor(type: PieceType): string {
  return COLORS[type];
}

export function getNextRotation(rotation: RotationState, clockwise: boolean): RotationState {
  if (clockwise) {
    return ((rotation + 1) % 4) as RotationState;
  }
  return ((rotation + 3) % 4) as RotationState;
}

export const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export function getRandomPieceType(): PieceType {
  return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
}
