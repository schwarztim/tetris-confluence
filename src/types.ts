export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type RotationState = 0 | 1 | 2 | 3;

export type Color = string;

export interface Piece {
  type: PieceType;
  rotation: RotationState;
  x: number;
  y: number;
  color: Color;
}

export interface BoardCell {
  filled: boolean;
  color: Color;
}

export type Board = BoardCell[][];

export interface GameState {
  board: Board;
  currentPiece: Piece | null;
  nextPiece: PieceType | null;
  holdPiece: PieceType | null;
  canHold: boolean;
  score: number;
  lines: number;
  level: number;
  isPaused: boolean;
  isGameOver: boolean;
  lastDrop: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface WallKickTest {
  x: number;
  y: number;
  rotation: RotationState;
  valid: boolean;
}

export type Direction = 'left' | 'right' | 'down';

export interface ScoringResult {
  score: number;
  linesCleared: number;
  isTetris: boolean;
  isTriple: boolean;
  isDouble: boolean;
  isSingle: boolean;
}
