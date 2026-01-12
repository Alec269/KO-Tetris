// TetrisGame.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE, TETROMINOS } from './types';
import type { Position, TetrominoType, TouchStartInfo } from './types';
import { styles } from './styles';
import {
   createEmptyBoard,
   randomPiece,
   rotateMatrix,
   checkCollision,
   mergePiece,
   clearLines,
   renderBoard
} from './gameUtils';


const TetrisGame: React.FC = () => {
   const [board, setBoard] = useState<(string | number)[][]>(createEmptyBoard());
   const [currentPiece, setCurrentPiece] = useState<{
      type: TetrominoType;
      shape: number[][];
      color: string;
   } | null>(null);
   const [nextPiece, setNextPiece] = useState<TetrominoType | null>(null);
   const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
   const [score, setScore] = useState<number>(0);
   const [lines, setLines] = useState<number>(0);
   const [level, setLevel] = useState<number>(1);
   const [gameOver, setGameOver] = useState<boolean>(false);
   const [isPaused, setIsPaused] = useState<boolean>(false);
   const [touchStart, setTouchStart] = useState<TouchStartInfo | null>(null);

   const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
   const dropSpeedRef = useRef<number>(800);
   const softDropRef = useRef<boolean>(false);

   const spawnPiece = useCallback(() => {
      const type = nextPiece || randomPiece();
      const tetro = TETROMINOS[type];

      const piece = {
         type,
         shape: tetro.shape.map(r => [...r]),
         color: tetro.color
      };

      const startX =
         Math.floor(BOARD_WIDTH / 2) -
         Math.floor(piece.shape[0].length / 2);

      const startY = 0;

      if (checkCollision(piece.shape, { x: startX, y: startY }, board)) {
         setGameOver(true);
         return;
      }

      setCurrentPiece(piece);
      setNextPiece(randomPiece());
      setPosition({ x: startX, y: startY });
   }, [nextPiece, board]);


   const movePiece = useCallback((dx: number, dy: number): boolean => {
      if (!currentPiece || gameOver || isPaused) return false;

      const newPos = { x: position.x + dx, y: position.y + dy };

      if (!checkCollision(currentPiece.shape, newPos, board)) {
         setPosition(newPos);
         return true;
      }
      return false;
   }, [currentPiece, position, gameOver, isPaused, board]);


   const dropPiece = useCallback(() => {
      if (!currentPiece) return;

      if (!movePiece(0, 1)) {
         const merged = mergePiece(
            board,
            currentPiece.shape,
            currentPiece.color,
            position
         );
         setBoard(clearLines(merged, level, setScore, setLines, setLevel));
         spawnPiece();
      }
   }, [currentPiece, board, position, level, spawnPiece, movePiece]);


   const hardDrop = useCallback(() => {
      if (!currentPiece || gameOver || isPaused) return;

      let newY = position.y;

      while (
         !checkCollision(
            currentPiece.shape,
            { x: position.x, y: newY + 1 },
            board
         )
      ) {
         newY++;
      }

      const finalPos = { x: position.x, y: newY };
      setPosition(finalPos);

      const merged = mergePiece(
         board,
         currentPiece.shape,
         currentPiece.color,
         finalPos
      );

      setBoard(clearLines(merged, level, setScore, setLines, setLevel));
      spawnPiece();
   }, [currentPiece, position, board, level, spawnPiece, gameOver, isPaused]);


   const softDrop = useCallback((active: boolean) => {
      softDropRef.current = active;
   }, []);

   const rotate = useCallback(() => {
      if (!currentPiece || gameOver || isPaused) return;

      const rotated = rotateMatrix(currentPiece.shape);

      if (!checkCollision(rotated, position, board)) {
         setCurrentPiece(p =>
            p ? { ...p, shape: rotated } : p
         );
      }
   }, [currentPiece, position, board, gameOver, isPaused]);


   const resetGame = () => {
      setBoard(createEmptyBoard());
      setScore(0);
      setLines(0);
      setLevel(1);
      setGameOver(false);
      setIsPaused(false);
      setNextPiece(randomPiece());
      setCurrentPiece(null);
   };

   useEffect(() => {
      if (!currentPiece && !gameOver) {
         spawnPiece();
      }
   }, [currentPiece, gameOver, spawnPiece]);

   useEffect(() => {
      dropSpeedRef.current = Math.max(100, 800 - (level - 1) * 80);
   }, [level]);

   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (gameOver) return;

         switch (e.key) {
            case 'ArrowLeft':
               e.preventDefault();
               movePiece(-1, 0);
               break;
            case 'ArrowRight':
               e.preventDefault();
               movePiece(1, 0);
               break;
            case 'ArrowDown':
               e.preventDefault();
               softDrop(true);
               break;
            case 'ArrowUp':
            case ' ':
               e.preventDefault();
               rotate();
               break;
            case 'p':
            case 'P':
               e.preventDefault();
               setIsPaused(p => !p);
               break;
         }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
         if (e.key === 'ArrowDown') {
            e.preventDefault();
            softDrop(false);
         }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
         window.removeEventListener('keydown', handleKeyDown);
         window.removeEventListener('keyup', handleKeyUp);
      };
   }, [movePiece, rotate, gameOver, softDrop]);

   useEffect(() => {
      if (gameOver || isPaused || !currentPiece) return;

      const speed = softDropRef.current ? 50 : dropSpeedRef.current;

      gameLoopRef.current = setInterval(() => {
         dropPiece();
      }, speed);

      return () => {
         if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      };
   }, [dropPiece, gameOver, isPaused, currentPiece, level]);

   const handleTouchStart = (e: React.TouchEvent) => {
      setTouchStart({
         x: e.touches[0].clientX,
         y: e.touches[0].clientY,
         time: Date.now()
      });
   };

   const handleTouchEnd = (e: React.TouchEvent) => {
      if (!touchStart) return;

      const touchEnd = {
         x: e.changedTouches[0].clientX,
         y: e.changedTouches[0].clientY
      };

      const dx = touchEnd.x - touchStart.x;
      const dy = touchEnd.y - touchStart.y;
      const dt = Date.now() - touchStart.time;

      if (Math.abs(dx) < 30 && Math.abs(dy) < 30 && dt < 200) {
         rotate();
      } else if (Math.abs(dx) > Math.abs(dy)) {
         if (dx > 30) movePiece(1, 0);
         else if (dx < -30) movePiece(-1, 0);
      } else {
         if (dy > 50) hardDrop();
      }

      setTouchStart(null);
   };

   const displayBoard = renderBoard(
      board,
      currentPiece?.shape ?? null,
      currentPiece?.color ?? null,
      position
   );



   return (
      <div style={styles.container}>
         <div style={styles.mainLayout}>
            <div style={{ width: '200px' }} /> {/* Spacer for symmetry */}
            <h1 style={styles.title}>TETRIS</h1>
            <div style={{ width: '200px' }} /> {/* Spacer for symmetry */}
         </div>

         <div style={styles.mainLayout}>
            {/* Left Panel */}
            <div style={styles.sidePanel}>
               <div style={styles.statsContainer}>
                  <div style={styles.statsGrid}>
                     <div>
                        <div style={styles.statLabel}>Score</div>
                        <div style={styles.statValue}>{score}</div>
                     </div>
                     <div>
                        <div style={styles.statLabel}>Lines</div>
                        <div style={styles.statValue}>{lines}</div>
                     </div>
                     <div>
                        <div style={styles.statLabel}>Level</div>
                        <div style={styles.statValue}>{level}</div>
                     </div>
                  </div>
               </div>

               <div style={styles.nextContainer}>
                  <div style={styles.nextLabel}>Next</div>
                  <div style={styles.nextPieceBox}>
                     {nextPiece && (
                        <div>
                           {TETROMINOS[nextPiece].shape.map((row, y) => (
                              <div key={y} style={styles.boardRow}>
                                 {row.map((cell, x) => (
                                    <div
                                       key={`${y}-${x}`}
                                       style={{
                                          width: CELL_SIZE,
                                          height: CELL_SIZE,
                                          backgroundColor: cell ? TETROMINOS[nextPiece].color : 'transparent'
                                       }}
                                    />
                                 ))}
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {/* Center Panel - Game Board */}
            <div style={styles.centerPanel}>
               <div
                  style={{
                     ...styles.board,
                     width: BOARD_WIDTH * CELL_SIZE,
                     height: BOARD_HEIGHT * CELL_SIZE
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
               >
                  {displayBoard.map((row, y) => (
                     <div key={y} style={styles.boardRow}>
                        {row.map((cell, x) => (
                           <div
                              key={`${y}-${x}`}
                              style={{
                                 ...styles.cell,
                                 width: CELL_SIZE,
                                 height: CELL_SIZE,
                                 backgroundColor: cell || '#0a0a0a'
                              }}
                           />
                        ))}
                     </div>
                  ))}
               </div>

               {gameOver && (
                  <div style={styles.gameOver}>
                     GAME OVER
                  </div>
               )}

               <div style={styles.controlsGrid}>
                  <button
                     onClick={() => movePiece(-1, 0)}
                     style={{ ...styles.button, ...styles.buttonBlue }}
                  >
                     ←
                  </button>
                  <button
                     onClick={rotate}
                     style={{ ...styles.button, ...styles.buttonGreen }}
                  >
                     ↻
                  </button>
                  <button
                     onClick={() => movePiece(1, 0)}
                     style={{ ...styles.button, ...styles.buttonBlue }}
                  >
                     →
                  </button>
                  <button
                     onMouseDown={() => softDrop(true)}
                     onMouseUp={() => softDrop(false)}
                     onMouseLeave={() => softDrop(false)}
                     onTouchStart={() => softDrop(true)}
                     onTouchEnd={() => softDrop(false)}
                     style={{ ...styles.button, ...styles.buttonYellow }}
                  >
                     ↓
                  </button>
                  <button
                     onClick={hardDrop}
                     style={{ ...styles.button, ...styles.buttonRed }}
                  >
                     DROP
                  </button>
                  <button
                     onClick={() => setIsPaused(!isPaused)}
                     style={{ ...styles.button, ...styles.buttonPurple }}
                     disabled={gameOver}
                  >
                     {isPaused ? '▶' : '⏸'}
                  </button>
               </div>

               <button
                  onClick={resetGame}
                  style={{ ...styles.button, ...styles.buttonGray }}
               >
                  NEW GAME
               </button>
            </div>

            {/* Right Panel - Instructions */}
            <div style={styles.instructionsPanel}>
               <div style={styles.instructionSection}>
                  <div style={styles.instructionTitle}>Keyboard</div>
                  <div style={styles.instructionList}>
                     <div>← → : Move left/right</div>
                     <div>↑ / Space : Rotate</div>
                     <div>↓ : Soft drop (hold)</div>
                     <div>P : Pause</div>
                  </div>
               </div>
               <div style={styles.instructionSection}>
                  <div style={styles.instructionTitle}>Touch</div>
                  <div style={styles.instructionList}>
                     <div>Swipe left/right : Move</div>
                     <div>Tap : Rotate</div>
                     <div>Swipe down : Hard drop</div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default TetrisGame;

