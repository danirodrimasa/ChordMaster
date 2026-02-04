
import { NoteInfo } from './types';

export const NOTES: NoteInfo[] = [
  { index: 0, letter: 'C', solfege: 'Do', isBlack: false },
  { index: 1, letter: 'C#', solfege: 'Do#', isBlack: true },
  { index: 2, letter: 'D', solfege: 'Re', isBlack: false },
  { index: 3, letter: 'D#', solfege: 'Re#', isBlack: true },
  { index: 4, letter: 'E', solfege: 'Mi', isBlack: false },
  { index: 5, letter: 'F', solfege: 'Fa', isBlack: false },
  { index: 6, letter: 'F#', solfege: 'Fa#', isBlack: true },
  { index: 7, letter: 'G', solfege: 'Sol', isBlack: false },
  { index: 8, letter: 'G#', solfege: 'Sol#', isBlack: true },
  { index: 9, letter: 'A', solfege: 'La', isBlack: false },
  { index: 10, letter: 'A#', solfege: 'La#', isBlack: true },
  { index: 11, letter: 'B', solfege: 'Si', isBlack: false },
];

export const CHORD_INTERVALS: Record<string, { name: string, intervals: number[] }> = {
  '': { name: 'Major', intervals: [0, 4, 7] },
  'm': { name: 'Minor', intervals: [0, 3, 7] },
  '7': { name: 'Dominant 7th', intervals: [0, 4, 7, 10] },
  'maj7': { name: 'Major 7th', intervals: [0, 4, 7, 11] },
  'm7': { name: 'Minor 7th', intervals: [0, 3, 7, 10] },
  'sus2': { name: 'Suspended 2nd', intervals: [0, 2, 7] },
  'sus4': { name: 'Suspended 4th', intervals: [0, 5, 7] },
  '5': { name: 'Power Chord', intervals: [0, 7] },
  '6': { name: 'Major 6th', intervals: [0, 4, 7, 9] },
  'm6': { name: 'Minor 6th', intervals: [0, 3, 7, 9] },
  'dim': { name: 'Diminished', intervals: [0, 3, 6] },
  'aug': { name: 'Augmented', intervals: [0, 4, 8] },
  '9': { name: 'Dominant 9th', intervals: [0, 4, 7, 10, 14] },
  'add9': { name: 'Added 9th', intervals: [0, 4, 7, 14] },
  'dim7': { name: 'Diminished 7th', intervals: [0, 3, 6, 9] },
  'm7b5': { name: 'Half-Diminished', intervals: [0, 3, 6, 10] },
};

// Guitar fingerings: -1 is muted (X), 0 is open (O). Array is [E, A, D, G, B, e]
export const GUITAR_FINGERINGS: Record<string, number[]> = {
  'C': [-1, 3, 2, 0, 1, 0],
  'Cm': [-1, 3, 5, 5, 4, 3],
  'D': [-1, -1, 0, 2, 3, 2],
  'Dm': [-1, -1, 0, 2, 3, 1],
  'E': [0, 2, 2, 1, 0, 0],
  'Em': [0, 2, 2, 0, 0, 0],
  'F': [1, 3, 3, 2, 1, 1],
  'Fm': [1, 3, 3, 1, 1, 1],
  'G': [3, 2, 0, 0, 0, 3],
  'Gm': [3, 5, 5, 3, 3, 3],
  'A': [-1, 0, 2, 2, 2, 0],
  'Am': [-1, 0, 2, 2, 1, 0],
  'B': [-1, 2, 4, 4, 4, 2],
  'Bm': [-1, 2, 4, 4, 3, 2],
  // 7ths
  'C7': [-1, 3, 2, 3, 1, 0],
  'D7': [-1, -1, 0, 2, 1, 2],
  'E7': [0, 2, 0, 1, 0, 0],
  'G7': [3, 2, 0, 0, 0, 1],
  'A7': [-1, 0, 2, 0, 2, 0],
  'B7': [-1, 2, 1, 2, 0, 2],
};

export const LETTER_NAMES = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
export const SOLFEGE_NAMES = ['Do', 'Do#', 'Reb', 'Re', 'Re#', 'Mib', 'Mi', 'Fa', 'Fa#', 'Solb', 'Sol', 'Sol#', 'Lab', 'La', 'La#', 'Sib', 'Si'];
