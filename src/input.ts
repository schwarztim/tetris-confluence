export type KeyCallback = () => void;

export type KeyAction = 'left' | 'right' | 'down' | 'rotateCW' | 'rotateCCW' | 'hardDrop' | 'hold' | 'pause' | 'restart';

export interface KeyBindings {
  left: KeyCallback;
  right: KeyCallback;
  down: KeyCallback;
  rotateCW: KeyCallback;
  rotateCCW: KeyCallback;
  hardDrop: KeyCallback;
  hold: KeyCallback;
  pause: KeyCallback;
  restart: KeyCallback;
}

export class InputHandler {
  private bindings: Partial<Record<KeyAction, KeyCallback>> = {};
  private keysPressed: Set<string> = new Set();
  private repeatDelays: Map<string, number> = new Map();
  private repeatIntervals: Map<string, number> = new Map();

  private readonly INITIAL_DELAY = 150;
  private readonly REPEAT_INTERVAL = 50;

  constructor(bindings: Partial<KeyBindings>) {
    this.bindings = bindings as Partial<Record<KeyAction, KeyCallback>>;
    this.setupListeners();
  }

  private setupListeners(): void {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (this.keysPressed.has(e.code)) return;
    
    this.keysPressed.add(e.code);
    
    const action = this.getAction(e.code);
    
    if (action && this.bindings[action]) {
      e.preventDefault();
      this.bindings[action]!();
      
      if (['left', 'right', 'down'].includes(action)) {
        this.startRepeat(action);
      }
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.keysPressed.delete(e.code);
    
    const action = this.getAction(e.code);
    if (action) {
      this.stopRepeat(action);
    }
  }

  private getAction(code: string): KeyAction | null {
    const keyMap: Record<string, KeyAction> = {
      'ArrowLeft': 'left',
      'ArrowRight': 'right',
      'ArrowDown': 'down',
      'ArrowUp': 'rotateCW',
      'KeyZ': 'rotateCCW',
      'Space': 'hardDrop',
      'KeyC': 'hold',
      'KeyP': 'pause',
      'KeyR': 'restart'
    };
    
    return keyMap[code] || null;
  }

  private startRepeat(action: KeyAction): void {
    if (this.repeatDelays.has(action)) return;
    
    const delayId = window.setTimeout(() => {
      const intervalId = window.setInterval(() => {
        if (this.bindings[action]) {
          this.bindings[action]!();
        }
      }, this.REPEAT_INTERVAL);
      
      this.repeatIntervals.set(action, intervalId);
    }, this.INITIAL_DELAY);
    
    this.repeatDelays.set(action, delayId);
  }

  private stopRepeat(action: KeyAction): void {
    const delayId = this.repeatDelays.get(action);
    if (delayId) {
      clearTimeout(delayId);
      this.repeatDelays.delete(action);
    }
    
    const intervalId = this.repeatIntervals.get(action);
    if (intervalId) {
      clearInterval(intervalId);
      this.repeatIntervals.delete(action);
    }
  }

  destroy(): void {
    this.repeatDelays.forEach(id => clearTimeout(id));
    this.repeatIntervals.forEach(id => clearInterval(id));
    this.repeatDelays.clear();
    this.repeatIntervals.clear();
  }
}
