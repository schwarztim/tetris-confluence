import { GameState } from './types';
import { TetrisBoard, createPiece } from './board';
import { Renderer } from './renderer';
import { InputHandler } from './input';
import { AudioManager } from './audio';
import { calculateScore, calculateLevel, getDropSpeed } from './scoring';
import { WALL_KICK_DATA } from './constants';
import { getNextRotation, getRandomPieceType } from './pieces';

export class TetrisGame {
  private board: TetrisBoard;
  private renderer: Renderer;
  private input: InputHandler;
  private audio: AudioManager;
  
  private state: GameState;
  private animationFrame: number = 0;
  private lastTime: number = 0;
  private dropCounter: number = 0;
  private dropInterval: number = 1000;

  constructor() {
    this.board = new TetrisBoard();
    this.renderer = new Renderer();
    this.renderer.setBoard(this.board);
    this.audio = new AudioManager();
    
    this.state = this.createInitialState();
    
    this.input = new InputHandler({
      left: () => this.moveLeft(),
      right: () => this.moveRight(),
      down: () => this.moveDown(),
      rotateCW: () => this.rotate(true),
      rotateCCW: () => this.rotate(false),
      hardDrop: () => this.hardDrop(),
      hold: () => this.hold(),
      pause: () => this.togglePause(),
      restart: () => this.restart()
    });
    
    this.startGame();
  }

  private createInitialState(): GameState {
    return {
      board: [],
      currentPiece: null,
      nextPiece: null,
      holdPiece: null,
      canHold: true,
      score: 0,
      lines: 0,
      level: 1,
      isPaused: false,
      isGameOver: false,
      lastDrop: 0
    };
  }

  private startGame(): void {
    this.state = this.createInitialState();
    this.board.reset();
    this.renderer.hideGameOver();
    this.renderer.hidePause();
    
    this.state.nextPiece = getRandomPieceType();
    this.spawnPiece();
    
    this.lastTime = 0;
    this.dropCounter = 0;
    this.dropInterval = getDropSpeed(1);
    
    this.gameLoop(0);
  }

  private spawnPiece(): void {
    if (!this.state.nextPiece) {
      this.state.nextPiece = getRandomPieceType();
    }
    
    const pieceType = this.state.nextPiece;
    this.state.currentPiece = createPiece(pieceType, 0);
    this.state.nextPiece = getRandomPieceType();
    this.state.canHold = true;
    
    this.renderer.renderNextPiece(this.state.nextPiece);
    
    if (!this.board.isValidPosition(this.state.currentPiece)) {
      this.gameOver();
    }
  }

  private gameLoop(currentTime: number): void {
    this.animationFrame = requestAnimationFrame((t) => this.gameLoop(t));
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    if (this.state.isPaused || this.state.isGameOver) {
      return;
    }
    
    this.dropCounter += deltaTime;
    
    if (this.dropCounter > this.dropInterval) {
      this.drop();
    }
    
    this.render();
  }

  private drop(): void {
    if (!this.state.currentPiece) return;
    
    const movedPiece = { ...this.state.currentPiece, y: this.state.currentPiece.y + 1 };
    
    if (this.board.isValidPosition(movedPiece)) {
      this.state.currentPiece.y++;
    } else {
      this.lockPiece();
    }
    
    this.dropCounter = 0;
  }

  private lockPiece(): void {
    if (!this.state.currentPiece) return;
    
    this.board.lockPiece(this.state.currentPiece);
    
    const linesCleared = this.board.clearLines();
    
    if (linesCleared > 0) {
      const result = calculateScore(linesCleared, this.state.level);
      this.state.score += result.score;
      this.state.lines += linesCleared;
      this.state.level = calculateLevel(this.state.lines);
      this.dropInterval = getDropSpeed(this.state.level);
      
      if (result.isTetris) {
        this.audio.playTetris();
      } else if (linesCleared > 0) {
        this.audio.playLineClear(linesCleared);
      }
    }
    
    this.spawnPiece();
    this.updateUI();
  }

  private moveLeft(): void {
    if (!this.state.currentPiece || this.state.isPaused || this.state.isGameOver) return;
    
    const movedPiece = { ...this.state.currentPiece, x: this.state.currentPiece.x - 1 };
    
    if (this.board.isValidPosition(movedPiece)) {
      this.state.currentPiece.x--;
      this.render();
    }
  }

  private moveRight(): void {
    if (!this.state.currentPiece || this.state.isPaused || this.state.isGameOver) return;
    
    const movedPiece = { ...this.state.currentPiece, x: this.state.currentPiece.x + 1 };
    
    if (this.board.isValidPosition(movedPiece)) {
      this.state.currentPiece.x++;
      this.render();
    }
  }

  private moveDown(): void {
    if (!this.state.currentPiece || this.state.isPaused || this.state.isGameOver) return;
    
    const movedPiece = { ...this.state.currentPiece, y: this.state.currentPiece.y + 1 };
    
    if (this.board.isValidPosition(movedPiece)) {
      this.state.currentPiece.y++;
      this.dropCounter = 0;
      this.render();
    }
  }

  private rotate(clockwise: boolean): void {
    if (!this.state.currentPiece || this.state.isPaused || this.state.isGameOver) return;
    
    const newRotation = getNextRotation(this.state.currentPiece.rotation, clockwise);
    const rotatedPiece = { ...this.state.currentPiece, rotation: newRotation };
    
    // Get the kick data based on current rotation and direction
    // For CW: use kicks from current state
    // For CCW: use kicks from new rotation state (reversed logic)
    const kickState = clockwise 
      ? this.state.currentPiece.rotation 
      : newRotation;
    const kicks = WALL_KICK_DATA[this.state.currentPiece.type][kickState];
    
    for (const kick of kicks) {
      const kickedPiece = {
        ...rotatedPiece,
        x: rotatedPiece.x + kick.x,
        y: rotatedPiece.y + kick.y
      };
      
      if (this.board.isValidPosition(kickedPiece)) {
        this.state.currentPiece = kickedPiece;
        this.audio.playRotate();
        this.render();
        return;
      }
    }
  }

  private hardDrop(): void {
    if (!this.state.currentPiece || this.state.isPaused || this.state.isGameOver) return;
    
    let dropDistance = 0;
    while (this.board.isValidPosition({ ...this.state.currentPiece, y: this.state.currentPiece.y + 1 })) {
      this.state.currentPiece.y++;
      dropDistance++;
    }
    
    if (dropDistance > 0) {
      this.audio.playHardDrop();
    }
    
    this.lockPiece();
  }

  private hold(): void {
    if (!this.state.currentPiece || !this.state.canHold || this.state.isPaused || this.state.isGameOver) return;
    
    const currentType = this.state.currentPiece.type;
    
    if (this.state.holdPiece === null) {
      this.state.holdPiece = currentType;
      this.spawnPiece();
    } else {
      const temp = this.state.holdPiece;
      this.state.holdPiece = currentType;
      this.state.currentPiece = createPiece(temp, 0);
    }
    
    this.state.canHold = false;
    this.renderer.renderHoldPiece(this.state.holdPiece);
    this.audio.playHold();
    this.render();
  }

  private togglePause(): void {
    if (this.state.isGameOver) return;
    
    this.state.isPaused = !this.state.isPaused;
    
    if (this.state.isPaused) {
      this.renderer.showPause();
    } else {
      this.renderer.hidePause();
      this.lastTime = performance.now();
    }
  }

  private restart(): void {
    this.state.isGameOver = false;
    this.state.isPaused = false;
    this.audio.playGameOver();
    this.startGame();
  }

  private gameOver(): void {
    this.state.isGameOver = true;
    this.renderer.showGameOver();
    this.audio.playGameOver();
  }

  private updateUI(): void {
    this.renderer.updateScore(this.state.score, this.state.lines, this.state.level);
  }

  private render(): void {
    const board = this.board.getBoard();
    this.renderer.renderBoard(board);
    
    if (this.state.currentPiece) {
      this.renderer.renderGhost(this.state.currentPiece);
      this.renderer.renderPiece(this.state.currentPiece);
    }
  }

  destroy(): void {
    cancelAnimationFrame(this.animationFrame);
    this.input.destroy();
  }
}
