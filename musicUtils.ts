
import { NOTES, CHORD_INTERVALS } from './constants';
import { NotationSystem } from './types';

export const getNoteIndex = (name: string): number => {
  if (!name) return 0;
  const cleanName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  
  const letterMap: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 
    'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
  };
  if (letterMap[cleanName] !== undefined) return letterMap[cleanName];

  const solfegeMap: Record<string, number> = {
    'Do': 0, 'Do#': 1, 'Reb': 1, 'Re': 2, 'Re#': 3, 'Mib': 3, 'Mi': 4, 'Fa': 5, 
    'Fa#': 6, 'Solb': 6, 'Sol': 7, 'Sol#': 8, 'Lab': 8, 'La': 9, 'La#': 10, 'Sib': 10, 'Si': 11
  };
  if (solfegeMap[cleanName] !== undefined) return solfegeMap[cleanName];

  // Handle single letters like 'C', 'D' etc.
  const firstChar = name.charAt(0).toUpperCase();
  if (letterMap[firstChar] !== undefined) return letterMap[firstChar];

  return 0;
};

export const parseChord = (chordStr: string) => {
  if (!chordStr) return { rootIndex: 0, quality: '', originalRoot: '' };
  
  const rootRegex = /^(Do#|Do|Reb|Re#|Re|Mib|Mi|Fa#|Fa|Solb|Sol#|Sol|Lab|La#|La|Sib|Si|[A-G][#b]?)/i;
  const match = chordStr.match(rootRegex);
  
  if (!match) return { rootIndex: 0, quality: '', originalRoot: '' };
  
  const root = match[0];
  const quality = chordStr.slice(root.length);
  return {
    rootIndex: getNoteIndex(root),
    quality: quality || '',
    originalRoot: root
  };
};

export const transposeChord = (chordStr: string, offset: number, system: NotationSystem): string => {
  const { rootIndex, quality } = parseChord(chordStr);
  const newIndex = (rootIndex + offset + 120) % 12;
  const noteInfo = NOTES.find(n => n.index === newIndex);
  
  if (!noteInfo) return chordStr;
  
  const rootName = system === 'letter' ? noteInfo.letter : noteInfo.solfege;
  return `${rootName}${quality}`;
};

export const getChordNotes = (chordStr: string, offset: number): number[] => {
  const { rootIndex, quality } = parseChord(chordStr);
  const transRootIndex = (rootIndex + offset + 120) % 12;
  
  const chordInfo = CHORD_INTERVALS[quality] || CHORD_INTERVALS[''];
  return chordInfo.intervals.map(i => (transRootIndex + i) % 12);
};
