import type { BreathingPattern } from '../types';

export type BreathPhase = 'inhale' | 'hold' | 'exhale';
export type SessionStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface BreathingSnapshot {
  status: SessionStatus;
  phase: BreathPhase;
  phaseElapsedMs: number;
  phaseDurationMs: number;
  cycle: number;
  totalCycles: number;
}

interface Callbacks {
  onTick: (snapshot: BreathingSnapshot) => void;
  onPhaseChange: (snapshot: BreathingSnapshot) => void;
  onComplete: () => void;
}

const phaseOrder: BreathPhase[] = ['inhale', 'hold', 'exhale'];

export class BreathingEngine {
  private status: SessionStatus = 'idle';
  private timer?: number;
  private phaseIndex = 0;
  private cycle = 1;
  private phaseStart = 0;
  private pauseRemainder = 0;

  constructor(
    private pattern: BreathingPattern,
    private totalCycles: number,
    private callbacks: Callbacks
  ) {}

  setPattern(pattern: BreathingPattern, totalCycles: number) {
    this.stop();
    this.pattern = pattern;
    this.totalCycles = totalCycles;
  }

  start() {
    this.stop();
    this.status = 'running';
    this.phaseIndex = 0;
    this.cycle = 1;
    this.phaseStart = Date.now();
    this.callbacks.onPhaseChange(this.snapshot(0));
    this.runTimer();
  }

  pause() {
    if (this.status !== 'running') return;
    this.status = 'paused';
    const duration = this.getCurrentDurationMs();
    this.pauseRemainder = Math.max(0, duration - (Date.now() - this.phaseStart));
    this.clearTimer();
  }

  resume() {
    if (this.status !== 'paused') return;
    this.status = 'running';
    this.phaseStart = Date.now() - (this.getCurrentDurationMs() - this.pauseRemainder);
    this.runTimer();
  }

  stop() {
    this.clearTimer();
    this.status = 'idle';
    this.phaseIndex = 0;
    this.cycle = 1;
    this.phaseStart = Date.now();
    this.pauseRemainder = 0;
    this.callbacks.onTick(this.snapshot(0));
  }

  getStatus() {
    return this.status;
  }

  private runTimer() {
    this.clearTimer();
    this.timer = window.setInterval(() => {
      if (this.status !== 'running') return;
      const elapsed = Date.now() - this.phaseStart;
      const duration = this.getCurrentDurationMs();

      if (elapsed >= duration) {
        this.advance();
        return;
      }

      this.callbacks.onTick(this.snapshot(elapsed));
    }, 100);
  }

  private advance() {
    if (this.phaseIndex < phaseOrder.length - 1) {
      this.phaseIndex += 1;
      this.phaseStart = Date.now();
      this.callbacks.onPhaseChange(this.snapshot(0));
      return;
    }

    if (this.cycle >= this.totalCycles) {
      this.status = 'completed';
      this.clearTimer();
      this.callbacks.onComplete();
      return;
    }

    this.cycle += 1;
    this.phaseIndex = 0;
    this.phaseStart = Date.now();
    this.callbacks.onPhaseChange(this.snapshot(0));
  }

  private getCurrentDurationMs() {
    const phase = phaseOrder[this.phaseIndex];
    const sec = phase === 'inhale' ? this.pattern.inhale : phase === 'hold' ? this.pattern.hold : this.pattern.exhale;
    return sec * 1000;
  }

  private snapshot(phaseElapsedMs: number): BreathingSnapshot {
    return {
      status: this.status,
      phase: phaseOrder[this.phaseIndex],
      phaseElapsedMs,
      phaseDurationMs: this.getCurrentDurationMs(),
      cycle: this.cycle,
      totalCycles: this.totalCycles
    };
  }

  private clearTimer() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
