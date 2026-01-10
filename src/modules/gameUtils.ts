// gameUtils.ts
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOS, PIECES } from './types';
import type { Position, TetrominoType } from './types';

export const createEmptyBoard = (): (string | number)[][] =>
  Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));

export const randomPiece = (): TetrominoType =>
  PIECES[Math.floor(Math.random() * PIECES.length)];

export const rotatePiece = (piece: TetrominoType): number[][] => {
  const shape = TETROMINOS[piece].shape;
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }

  return rotated;
};

export const checkCollision = (
  piece: TetrominoType | number[][],
  pos: Position,
  board: (string | number)[][]
): boolean => {
  const shape = typeof piece === 'string' ? TETROMINOS[piece].shape : piece;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const newY = pos.y + r;
        const newX = pos.x + c;

        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return true;
        }
        if (newY >= 0 && board[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
};

export const mergePiece = (
  board: (string | number)[][],
  currentPiece: TetrominoType,
  position: Position
): (string | number)[][] => {
  const newBoard = board.map(row => [...row]);
  const shape = TETROMINOS[currentPiece].shape;
  const color = TETROMINOS[currentPiece].color;

  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const y = position.y + r;
        const x = position.x + c;
        if (y >= 0) {
          newBoard[y][x] = color;
        }
      }
    }
  }

  return newBoard;
};

export const clearLines = (
  boardState: (string | number)[][],
  level: number,
  setScore: (updater: (s: number) => number) => void,
  setLines: (updater: (l: number) => number) => void,
  setLevel: (level: number) => void
): (string | number)[][] => {
  let linesCleared = 0;
  const newBoard = boardState.filter(row => {
    if (row.every(cell => cell !== 0)) {
      linesCleared++;
      return false;
    }
    return true;
  });

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0));
  }

  if (linesCleared > 0) {
    const points = [0, 40, 100, 300, 1200][linesCleared] * level;
    setScore(s => s + points);
    setLines(l => {
      const newLines = l + linesCleared;
      setLevel(Math.floor(newLines / 10) + 1);
      return newLines;
    });
  }

  return newBoard;
};

export const renderBoard = (
  board: (string | number)[][],
  currentPiece: TetrominoType | null,
  position: Position
): (string | number)[][] => {
  const displayBoard = board.map(row => [...row]);

  if (currentPiece) {
    const shape = TETROMINOS[currentPiece].shape;
    const color = TETROMINOS[currentPiece].color;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const y = position.y + r;
          const x = position.x + c;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            displayBoard[y][x] = color;
          }
        }
      }
    }
  }

  return displayBoard;
};