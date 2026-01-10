// types.ts
export interface Position {
  x: number;
  y: number;
}

export interface Tetromino {
  shape: number[][];
  color: string;
}

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface TouchStartInfo {
  x: number;
  y: number;
  time: number;
}


// constants
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 24;

export const TETROMINOS: Record<TetrominoType, Tetromino> = {
  I: { shape: [[1, 1, 1, 1]], color: '#5de7e7' },
  O: { shape: [[1, 1], [1, 1]], color: '#dfdf4d' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#b051e0' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#69d369' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#e06666' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#4c4ce0' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#ebb74f' }
};

export const PIECES: TetrominoType[] = Object.keys(TETROMINOS) as TetrominoType[];