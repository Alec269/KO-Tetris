// gameUtils.ts
import { BOARD_WIDTH, BOARD_HEIGHT } from './types';
import type { Position } from './types';

export const createEmptyBoard = (): (string | number)[][] =>
  Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(0)
  );

export const rotateMatrix = (matrix: number[][]): number[][] => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array.from({ length: cols }, () => Array(rows).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      result[c][rows - 1 - r] = matrix[r][c];
    }
  }
  return result;
};

export const checkCollision = (
  shape: number[][],
  pos: Position,
  board: (string | number)[][]
): boolean => {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;

      const x = pos.x + c;
      const y = pos.y + r;

      if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) return true;
      if (y >= 0 && board[y][x]) return true;
    }
  }
  return false;
};

export const mergePiece = (
  board: (string | number)[][],
  shape: number[][],
  color: string,
  pos: Position
) => {
  const newBoard = board.map(r => [...r]);

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const y = pos.y + r;
        const x = pos.x + c;
        if (y >= 0) newBoard[y][x] = color;
      }
    }
  }
  return newBoard;
};

export const renderBoard = (
  board: (string | number)[][],
  shape: number[][] | null,
  color: string | null,
  pos: Position
) => {
  const display = board.map(r => [...r]);
  if (!shape || !color) return display;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const y = pos.y + r;
        const x = pos.x + c;
        if (y >= 0 && y < display.length) {
          display[y][x] = color;
        }
      }
    }
  }
  return display;
};
