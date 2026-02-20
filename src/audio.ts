export class AudioManager {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled: boolean = true;

  constructor() {
    this.initContext();
  }

  private initContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.audioContext.destination);
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  private ensureContext(): boolean {
    if (!this.enabled || !this.audioContext || !this.masterGain) {
      return false;
    }
    
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    return true;
  }

  playRotate(): void {
    if (!this.ensureContext()) return;
    
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(220, this.audioContext!.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.audioContext!.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.1, this.audioContext!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start();
    osc.stop(this.audioContext!.currentTime + 0.05);
  }

  playLineClear(lines: number): void {
    if (!this.ensureContext()) return;
    
    const baseFreq = lines >= 4 ? 400 : 300;
    const duration = lines >= 4 ? 0.3 : 0.15;
    
    for (let i = 0; i < lines; i++) {
      setTimeout(() => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(baseFreq + i * 50, this.audioContext!.currentTime);
        osc.frequency.exponentialRampToValueAtTime(baseFreq + i * 100, this.audioContext!.currentTime + duration);
        
        gain.gain.setValueAtTime(0.15, this.audioContext!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.start();
        osc.stop(this.audioContext!.currentTime + duration);
      }, i * 50);
    }
  }

  playTetris(): void {
    if (!this.ensureContext()) return;
    
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const duration = 0.1;
    
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, this.audioContext!.currentTime);
        
        gain.gain.setValueAtTime(0.15, this.audioContext!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.start();
        osc.stop(this.audioContext!.currentTime + duration);
      }, i * 80);
    });
  }

  playGameOver(): void {
    if (!this.ensureContext()) return;
    
    const notes = [392, 349.23, 329.63, 293.66, 261.63];
    const duration = 0.2;
    
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.audioContext!.currentTime);
        
        gain.gain.setValueAtTime(0.15, this.audioContext!.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.start();
        osc.stop(this.audioContext!.currentTime + duration);
      }, i * 150);
    });
  }

  playHardDrop(): void {
    if (!this.ensureContext()) return;
    
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.audioContext!.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.audioContext!.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.15, this.audioContext!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start();
    osc.stop(this.audioContext!.currentTime + 0.1);
  }

  playHold(): void {
    if (!this.ensureContext()) return;
    
    const osc = this.audioContext!.createOscillator();
    const gain = this.audioContext!.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.audioContext!.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.audioContext!.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.1, this.audioContext!.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start();
    osc.stop(this.audioContext!.currentTime + 0.08);
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}
