
import React from 'react';

interface PianoProps {
  activeNotes: number[]; // Semitone indices 0-11
  isDarkMode: boolean;
  variant?: 'mini' | 'full';
}

const Piano: React.FC<PianoProps> = ({ activeNotes, isDarkMode, variant = 'full' }) => {
  // We show 2 octaves for context, but only 1 octave for the actual dots (one hand)
  const whiteKeyIndices = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23];
  const blackKeys = [
    { idx: 1, pos: 0 },   { idx: 3, pos: 1 },   { idx: 6, pos: 3 },   { idx: 8, pos: 4 },   { idx: 10, pos: 5 },
    { idx: 13, pos: 7 },  { idx: 15, pos: 8 },  { idx: 18, pos: 10 }, { idx: 20, pos: 11 }, { idx: 22, pos: 12 },
  ];

  const WHITE_WIDTH = variant === 'mini' ? 14 : 44;
  const BLACK_WIDTH = variant === 'mini' ? 9 : 26;
  const PIANO_HEIGHT = variant === 'mini' ? 'h-10' : 'h-40';
  const BLACK_HEIGHT = variant === 'mini' ? 'h-6' : 'h-24';
  const DOT_SIZE = variant === 'mini' ? 'w-1.5 h-1.5' : 'w-4 h-4';
  const BLACK_DOT_SIZE = variant === 'mini' ? 'w-1 h-1' : 'w-3 h-3';

  return (
    <div className={`relative flex justify-center ${PIANO_HEIGHT} select-none transition-all w-full max-w-full overflow-hidden px-1`}>
      <div className={`relative flex rounded-sm overflow-hidden border ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
        {/* White Keys */}
        {whiteKeyIndices.map((absIdx) => {
          const noteIndex = absIdx % 12;
          // One-hand logic: Only highlight notes if they are in the first octave
          const isNoteInFirstOctave = absIdx < 12;
          const isActive = isNoteInFirstOctave && activeNotes.includes(noteIndex);

          return (
            <div
              key={`white-${absIdx}`}
              className={`
                relative border-r last:border-r-0 transition-colors duration-200 flex flex-col items-center justify-end pb-1
                ${isDarkMode ? 'bg-white border-slate-300' : 'bg-white border-gray-100'}
                h-full
              `}
              style={{ width: `${WHITE_WIDTH}px`, flexShrink: 0 }}
            >
              {isActive && (
                <div className={`${DOT_SIZE} rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-in zoom-in duration-300`} />
              )}
            </div>
          );
        })}

        {/* Black Keys */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {blackKeys.map((key) => {
            const noteIndex = key.idx % 12;
            const isNoteInFirstOctave = key.idx < 12;
            const isActive = isNoteInFirstOctave && activeNotes.includes(noteIndex);
            
            const leftPos = (key.pos + 1) * WHITE_WIDTH - (BLACK_WIDTH / 2); 

            return (
              <div
                key={`black-${key.idx}`}
                className={`
                  absolute top-0 rounded-b-sm transition-colors duration-200 pointer-events-auto
                  flex flex-col items-center justify-end pb-0.5
                  ${isDarkMode ? 'bg-slate-800 border-x border-b border-slate-950' : 'bg-gray-900'}
                  ${BLACK_HEIGHT}
                `}
                style={{ left: `${leftPos}px`, width: `${BLACK_WIDTH}px` }}
              >
                {isActive && (
                  <div className={`${BLACK_DOT_SIZE} rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.6)] animate-in zoom-in duration-300`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Piano;
