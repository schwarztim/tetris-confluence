import { Board, BoardCell, Piece, PieceType, RotationState } from './types';
import { COLS, ROWS, EMPTY_CELL, COLORS, SPAWN_X, SPAWN_Y } from './constants';
import { getPieceShape } from './pieces';

export class TetrisBoard {
  private board: Board;
  private clearedRows: number[];

  constructor() {
    this.board = this.createEmptyBoard();
    this.clearedRows = [];
  }

  private createEmptyBoard(): Board {
    const board: Board = [];
    for (let y = 0; y < ROWS; y++) {
      const row: BoardCell[] = [];
      for (let x = 0; x < COLS; x++) {
        row.push({ filled: false, color: EMPTY_CELL });
      }
      board.push(row);
    }
    return board;
  }

  reset(): void {
    this.board = this.createEmptyBoard();
    this.clearedRows = [];
  }

  getBoard(): Board {
    return this.board;
  }

  isValidPosition(piece: Piece): boolean {
    const shape = getPieceShape(piece.type, piece.rotation);
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
            return false;
          }
          
          if (boardY >= 0 && this.board[boardY][boardX].filled) {
            return false;
          }
        }
      }
    }
    
    return true;
  }

  lockPiece(piece: Piece): void {
    const shape = getPieceShape(piece.type, piece.rotation);
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            this.board[boardY][boardX] = {
              filled: true,
              color: piece.color
            };
          }
        }
      }
    }
  }

  clearLines(): number {
    this.clearedRows = [];
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
      if (this.isLineFull(y)) {
        this.clearRow(y);
        this.clearedRows.push(y);
        linesCleared++;
        y++;
      }
    }
    
    return linesCleared;
  }

  private isLineFull(y: number): boolean {
    for (let x = 0; x < COLS; x++) {
      if (!this.board[y][x].filled) {
        return false;
      }
    }
    return true;
  }

  private clearRow(y: number): void {
    for (let row = y; row > 0; row--) {
      for (let x = 0; x < COLS; x++) {
        this.board[row][x] = this.board[row - 1][x];
      }
    }
    
    for (let x = 0; x < COLS; x++) {
      this.board[0][x] = { filled: false, color: EMPTY_CELL };
    }
  }

  isGameOver(): boolean {
    for (let x = 0; x < COLS; x++) {
      if (this.board[0][x].filled) {
        return true;
      }
    }
    return false;
  }

  getCell(x: number, y: number): BoardCell {
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) {
      return { filled: false, color: EMPTY_CELL };
    }
    return this.board[y][x];
  }

  getDropPosition(piece: Piece): Piece {
    let dropY = piece.y;
    while (this.isValidPosition({ ...piece, y: dropY + 1 })) {
      dropY++;
    }
    return { ...piece, y: dropY };
  }
}

export function createPiece(type: PieceType, rotation: RotationState = 0): Piece {
  return {
    type,
    rotation,
    x: SPAWN_X[type],
    y: SPAWN_Y[type],
    color: COLORS[type]
  };
}
