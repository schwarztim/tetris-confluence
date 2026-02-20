import { Board, Piece, PieceType } from './types';
import { COLS, ROWS, CELL_SIZE, EMPTY_CELL, COLORS } from './constants';
import { getPieceShape } from './pieces';
import { TetrisBoard } from './board';

export class Renderer {
  private gameCanvas: HTMLCanvasElement;
  private gameCtx: CanvasRenderingContext2D;
  private nextCanvas: HTMLCanvasElement;
  private nextCtx: CanvasRenderingContext2D;
  private holdCanvas: HTMLCanvasElement;
  private holdCtx: CanvasRenderingContext2D;
  private tetrisBoard: TetrisBoard | null = null;

  constructor() {
    this.gameCanvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.gameCtx = this.gameCanvas.getContext('2d')!;
    this.nextCanvas = document.getElementById('next-canvas') as HTMLCanvasElement;
    this.nextCtx = this.nextCanvas.getContext('2d')!;
    this.holdCanvas = document.getElementById('hold-canvas') as HTMLCanvasElement;
    this.holdCtx = this.holdCanvas.getContext('2d')!;
  }

  setBoard(board: TetrisBoard): void {
    this.tetrisBoard = board;
  }

  clearGame(): void {
    this.gameCtx.fillStyle = EMPTY_CELL;
    this.gameCtx.fillRect(0, 0, COLS * CELL_SIZE, ROWS * CELL_SIZE);
  }

  clearNext(): void {
    this.nextCtx.fillStyle = '#1a1a2e';
    this.nextCtx.fillRect(0, 0, 100, 80);
  }

  clearHold(): void {
    this.holdCtx.fillStyle = '#1a1a2e';
    this.holdCtx.fillRect(0, 0, 100, 80);
  }

  renderBoard(board: Board): void {
    this.clearGame();
    
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = board[y][x];
        this.drawCell(this.gameCtx, x, y, cell.filled ? cell.color : EMPTY_CELL);
      }
    }
  }

  renderPiece(piece: Piece, ghost: boolean = false): void {
    const shape = getPieceShape(piece.type, piece.rotation);
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
            this.drawCell(
              this.gameCtx,
              boardX,
              boardY,
              ghost ? this.adjustColor(piece.color, 0.3) : piece.color
            );
          }
        }
      }
    }
  }

  renderGhost(piece: Piece): void {
    if (!this.tetrisBoard) return;
    
    const ghostPosition = this.tetrisBoard.getDropPosition(piece);
    this.renderPiece(ghostPosition, true);
  }

  private isValidPosition(piece: Piece): boolean {
    const shape = getPieceShape(piece.type, piece.rotation);
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
            return false;
          }
        }
      }
    }
    
    return true;
  }

  renderNextPiece(type: PieceType): void {
    this.clearNext();
    
    if (!type) return;
    
    const color = COLORS[type];
    const shape = getPieceShape(type, 0);
    
    const pieceWidth = shape[0].length * 20;
    const pieceHeight = shape.length * 20;
    const offsetX = (100 - pieceWidth) / 2;
    const offsetY = (80 - pieceHeight) / 2;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          this.drawMiniCell(this.nextCtx, offsetX + x * 20, offsetY + y * 20, color);
        }
      }
    }
  }

  renderHoldPiece(type: PieceType | null): void {
    this.clearHold();
    
    if (!type) return;
    
    const color = COLORS[type];
    const shape = getPieceShape(type, 0);
    
    const pieceWidth = shape[0].length * 20;
    const pieceHeight = shape.length * 20;
    const offsetX = (100 - pieceWidth) / 2;
    const offsetY = (80 - pieceHeight) / 2;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          this.drawMiniCell(this.holdCtx, offsetX + x * 20, offsetY + y * 20, color);
        }
      }
    }
  }

  private drawCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    const px = x * CELL_SIZE;
    const py = y * CELL_SIZE;
    
    ctx.fillStyle = color;
    ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, 3);
    ctx.fillRect(px + 1, py + 1, 3, CELL_SIZE - 2);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(px + 1, py + CELL_SIZE - 4, CELL_SIZE - 2, 3);
    ctx.fillRect(px + CELL_SIZE - 4, py + 1, 3, CELL_SIZE - 2);
  }

  private drawMiniCell(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, 18, 18);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x + 1, y + 1, 18, 2);
    ctx.fillRect(x + 1, y + 1, 2, 18);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(x + 1, y + 16, 18, 2);
    ctx.fillRect(x + 16, y + 1, 2, 18);
  }

  private adjustColor(color: string, factor: number): string {
    const hex = color.replace('#', '');
    const r = Math.floor(parseInt(hex.slice(0, 2), 16) * factor);
    const g = Math.floor(parseInt(hex.slice(2, 4), 16) * factor);
    const b = Math.floor(parseInt(hex.slice(4, 6), 16) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  }

  updateScore(score: number, lines: number, level: number): void {
    document.getElementById('score')!.textContent = score.toString();
    document.getElementById('lines')!.textContent = lines.toString();
    document.getElementById('level')!.textContent = level.toString();
  }

  showGameOver(): void {
    document.getElementById('game-over')!.classList.remove('hidden');
  }

  hideGameOver(): void {
    document.getElementById('game-over')!.classList.add('hidden');
  }

  showPause(): void {
    document.getElementById('pause')!.classList.remove('hidden');
  }

  hidePause(): void {
    document.getElementById('pause')!.classList.add('hidden');
  }
}
