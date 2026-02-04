
import React from 'react';
import { GUITAR_FINGERINGS } from '../constants';
import { parseChord } from '../musicUtils';

interface GuitarProps {
  chordName: string; 
  isDarkMode: boolean;
  variant?: 'mini' | 'full';
}

const Guitar: React.FC<GuitarProps> = ({ chordName, isDarkMode, variant = 'full' }) => {
  const { originalRoot, quality } = parseChord(chordName);
  
  // Normalize quality for lookup
  let lookup = chordName;
  if (!GUITAR_FINGERINGS[lookup]) {
    lookup = originalRoot + (quality === 'm' ? 'm' : '');
  }
  
  let fingering = GUITAR_FINGERINGS[lookup] || GUITAR_FINGERINGS[originalRoot] || [-1, -1, -1, -1, -1, -1];

  const frets = [1, 2, 3, 4, 5];
  const strings = [0, 1, 2, 3, 4, 5]; // E, A, D, G, B, e (Standard order for rendering left-to-right)

  const DIAGRAM_WIDTH = variant === 'mini' ? 70 : 140;
  const DIAGRAM_HEIGHT = variant === 'mini' ? 90 : 180;
  const FRET_SPACING = DIAGRAM_HEIGHT / 5;
  const STRING_SPACING = DIAGRAM_WIDTH / 5;

  // Calculate Barre
  // A barre usually spans 3+ strings on the same fret.
  const fretCounts: Record<number, number[]> = {};
  fingering.forEach((fret, sIdx) => {
    if (fret > 0) {
      if (!fretCounts[fret]) fretCounts[fret] = [];
      fretCounts[fret].push(sIdx);
    }
  });
  
  const barreFret = Object.keys(fretCounts).find(f => fretCounts[Number(f)].length >= 3);
  const barreIndices = barreFret ? fretCounts[Number(barreFret)] : null;

  return (
    <div className={`flex flex-col items-center justify-center p-2`}>
      <div 
        className="relative" 
        style={{ width: `${DIAGRAM_WIDTH}px`, height: `${DIAGRAM_HEIGHT + 25}px` }}
      >
        {/* Nut (Top thick bar) */}
        <div className={`absolute top-6 left-0 w-full h-1.5 ${isDarkMode ? 'bg-slate-300' : 'bg-slate-800'}`} />

        {/* Frets (Horizontal Lines) */}
        {frets.map(f => (
          <div 
            key={f}
            className={`absolute left-0 w-full h-[1px] ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}
            style={{ top: `${6 + 20 + f * FRET_SPACING}px` }}
          />
        ))}

        {/* Strings (Vertical Lines) */}
        {strings.map(s => (
          <div 
            key={s}
            className={`absolute top-6 w-[1.5px] h-full ${isDarkMode ? 'bg-slate-600' : 'bg-slate-400'}`}
            style={{ 
              left: `${s * STRING_SPACING}px`, 
              height: `${DIAGRAM_HEIGHT}px`,
              opacity: fingering[s] === -1 ? 0.2 : 1 
            }}
          />
        ))}

        {/* Status Indicators (Above the Nut) */}
        {fingering.map((fret, s) => (
          <div 
            key={s} 
            className="absolute top-0 flex justify-center items-center"
            style={{ 
              left: `${s * STRING_SPACING}px`, 
              width: '1px', 
              transform: 'translateX(-50%)' 
            }}
          >
            {fret === -1 ? (
              <span className={`text-[10px] font-black ${isDarkMode ? 'text-red-500/60' : 'text-red-500/80'}`}>X</span>
            ) : fret === 0 ? (
              <div className={`w-2 h-2 rounded-full border-2 ${isDarkMode ? 'border-indigo-400' : 'border-indigo-600'}`} />
            ) : null}
          </div>
        ))}

        {/* Barre Chord Line */}
        {barreIndices && barreFret && (
          <div 
            className="absolute rounded-full bg-slate-800 dark:bg-slate-200 z-10 opacity-90 shadow-sm"
            style={{
              top: `${26 + (Number(barreFret) - 0.5) * FRET_SPACING - (variant === 'mini' ? 4 : 6)}px`,
              left: `${barreIndices[0] * STRING_SPACING - 4}px`,
              width: `${(barreIndices[barreIndices.length - 1] - barreIndices[0]) * STRING_SPACING + 8}px`,
              height: `${variant === 'mini' ? 8 : 12}px`
            }}
          />
        )}

        {/* Finger Dots (Black spots for fingers) */}
        {fingering.map((fret, s) => {
          if (fret <= 0) return null;
          // Don't show redundant dots under the barre line unless they are the extremes
          return (
            <div 
              key={s}
              className={`absolute rounded-full ${isDarkMode ? 'bg-slate-100' : 'bg-slate-900'} z-20 shadow-md ${variant === 'mini' ? 'w-2.5 h-2.5' : 'w-5 h-5'}`}
              style={{
                top: `${26 + (fret - 0.5) * FRET_SPACING - (variant === 'mini' ? 5 : 10)}px`,
                left: `${s * STRING_SPACING - (variant === 'mini' ? 5 : 10)}px`
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Guitar;
