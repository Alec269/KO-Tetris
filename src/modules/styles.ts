// styles.ts
// styles.ts
import type { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
   container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#1a202c',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
   },
   title: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '24px',
      textAlign: 'center',
      letterSpacing: '4px'
   },
   mainLayout: {
      display: 'flex',
      flexDirection: 'row',
      gap: '32px',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap'
   },
   sidePanel: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '200px'
   },
   statsContainer: {
      backgroundColor: '#2d3748',
      padding: '20px',
      borderRadius: '12px',
      color: 'white'
   },
   statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      textAlign: 'center'
   },
   statLabel: {
      color: '#a0aec0',
      fontSize: '11px',
      marginBottom: '6px',
      fontWeight: '600',
      textTransform: 'uppercase'
   },
   statValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: 'white'
   },
   nextContainer: {
      backgroundColor: '#2d3748',
      padding: '20px',
      borderRadius: '12px'
   },
   nextLabel: {
      color: 'white',
      fontSize: '14px',
      marginBottom: '12px',
      textAlign: 'center',
      fontWeight: '600',
      textTransform: 'uppercase'
   },
   nextPieceBox: {
      backgroundColor: '#000',
      padding: '20px',
      border: '3px solid #4a5568',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100px',
      minWidth: '100px'
   },
   centerPanel: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      alignItems: 'center'
   },
   board: {
      border: '4px solid #4a5568',
      backgroundColor: '#000',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      borderRadius: '4px'
   },
   boardRow: {
      display: 'flex'
   },
   cell: {
      border: '1px solid #2d3748',
      boxSizing: 'border-box'
   },
   gameOver: {
      backgroundColor: '#e53e3e',
      padding: '20px',
      borderRadius: '12px',
      textAlign: 'center',
      fontWeight: 'bold',
      color: 'white',
      fontSize: '24px',
      letterSpacing: '2px'
   },
   controlsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      width: '100%',
      maxWidth: '360px'
   },
   button: {
      padding: '16px 20px',
      borderRadius: '10px',
      fontSize: '22px',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      transition: 'all 0.2s',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
   },
   buttonBlue: {
      backgroundColor: '#3182ce'
   },
   buttonGreen: {
      backgroundColor: '#38a169'
   },
   buttonYellow: {
      backgroundColor: '#d69e2e'
   },
   buttonRed: {
      backgroundColor: '#e53e3e'
   },
   buttonPurple: {
      backgroundColor: '#805ad5'
   },
   buttonGray: {
      backgroundColor: '#4a5568',
      gridColumn: 'span 3'
   },
   instructionsPanel: {
      backgroundColor: '#2d3748',
      padding: '20px',
      borderRadius: '12px',
      color: 'white',
      fontSize: '13px',
      width: '200px'
   },
   instructionSection: {
      marginBottom: '20px'
   },
   instructionTitle: {
      fontWeight: 'bold',
      marginBottom: '10px',
      fontSize: '14px',
      textTransform: 'uppercase',
      color: '#a0aec0'
   },
   instructionList: {
      fontSize: '12px',
      lineHeight: '1.8',
      color: '#cbd5e0'
   }
};
