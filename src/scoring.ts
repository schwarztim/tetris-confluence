import { ScoringResult } from './types';
import { SCORING, LINES_PER_LEVEL, INITIAL_LEVEL } from './constants';

export function calculateScore(linesCleared: number, level: number): ScoringResult {
  let score = 0;
  let isTetris = false;
  let isTriple = false;
  let isDouble = false;
  let isSingle = false;
  
  switch (linesCleared) {
    case 1:
      score = SCORING.SINGLE * level;
      isSingle = true;
      break;
    case 2:
      score = SCORING.DOUBLE * level;
      isDouble = true;
      break;
    case 3:
      score = SCORING.TRIPLE * level;
      isTriple = true;
      break;
    case 4:
      score = SCORING.TETRIS * level;
      isTetris = true;
      break;
    default:
      score = 0;
  }
  
  return {
    score,
    linesCleared,
    isTetris,
    isTriple,
    isDouble,
    isSingle
  };
}

export function calculateLevel(linesCleared: number): number {
  const newLevel = Math.floor(linesCleared / LINES_PER_LEVEL) + INITIAL_LEVEL;
  return Math.min(newLevel, 20);
}

export function getDropSpeed(level: number): number {
  const speeds: Record<number, number> = {
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
  
  return speeds[level] || 20;
}
