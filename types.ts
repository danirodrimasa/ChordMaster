
export type NotationSystem = 'letter' | 'solfege';
export type VisualizerType = 'piano' | 'guitar';

export interface ChordData {
  id: string;
  originalValue: string; // The text user entered (e.g., "Cmaj7")
}

export interface SongSection {
  id: string;
  name: string;
  chords: ChordData[];
}

export interface Song {
  id: string;
  title: string;
  author: string;
  sections: SongSection[];
  createdAt: number;
  lastModified: number;
}

export interface NoteInfo {
  index: number;      // 0-11
  letter: string;     // C, C#, etc.
  solfege: string;    // Do, Do#, etc.
  isBlack: boolean;
}
