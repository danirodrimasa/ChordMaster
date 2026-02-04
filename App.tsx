
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Music, 
  Sun, 
  Moon,
  Keyboard,
  ArrowLeft,
  Info,
  ListFilter,
  Layers,
  Download,
  Upload
} from 'lucide-react';
import { Song, SongSection, NotationSystem, ChordData, VisualizerType } from './types';
import { transposeChord, getChordNotes, parseChord } from './musicUtils';
import { CHORD_INTERVALS, NOTES } from './constants';
import Piano from './components/Piano';
import Guitar from './components/Guitar';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  // --- State ---
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [notation, setNotation] = useState<NotationSystem>('letter');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [transposition, setTransposition] = useState(0);
  const [selectedChordId, setSelectedChordId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'editor' | 'config'>('editor');
  const [showChordPicker, setShowChordPicker] = useState<string | null>(null);
  const [visualizerType, setVisualizerType] = useState<VisualizerType>('piano');
  const [libraryRoot, setLibraryRoot] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem('chordmaster_songs');
    if (saved) {
      try {
        setSongs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse songs", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chordmaster_songs', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.className = 'bg-slate-950 text-slate-100 transition-colors duration-300';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.className = 'bg-gray-50 text-gray-900 transition-colors duration-300';
    }
  }, [isDarkMode]);

  // --- Computed ---
  const currentSong = useMemo(() => 
    songs.find(s => s.id === currentSongId), 
    [songs, currentSongId]
  );

  const activeChordNotes = useMemo(() => {
    if (!selectedChordId || !currentSong) return [];
    
    let foundChord: ChordData | undefined;
    for (const section of currentSong.sections) {
      foundChord = section.chords.find(c => c.id === selectedChordId);
      if (foundChord) break;
    }

    if (!foundChord) return [];
    return getChordNotes(foundChord.originalValue, transposition);
  }, [selectedChordId, currentSong, transposition]);

  const activeChordName = useMemo(() => {
    if (!selectedChordId || !currentSong) return '';
    let foundChord: ChordData | undefined;
    for (const section of currentSong.sections) {
      foundChord = section.chords.find(c => c.id === selectedChordId);
      if (foundChord) break;
    }
    return foundChord?.originalValue || '';
  }, [selectedChordId, currentSong]);

  // --- Handlers ---
  const handleCreateSong = () => {
    const newSong: Song = {
      id: crypto.randomUUID(),
      title: 'Untitled Track',
      author: 'Unknown Artist',
      sections: [{ id: crypto.randomUUID(), name: 'Verse 1', chords: [] }],
      createdAt: Date.now(),
      lastModified: Date.now(),
    };
    setSongs(prev => [...prev, newSong]);
    setCurrentSongId(newSong.id);
    setTransposition(0);
    setCurrentView('editor');
  };

  const handleDeleteSong = (id: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return;
    setSongs(prev => prev.filter(s => s.id !== id));
    if (currentSongId === id) setCurrentSongId(null);
  };

  const updateSong = (updated: Song) => {
    setSongs(prev => prev.map(s => s.id === updated.id ? { ...updated, lastModified: Date.now() } : s));
  };

  const addSection = () => {
    if (!currentSong) return;
    const newSection: SongSection = { id: crypto.randomUUID(), name: 'Section', chords: [] };
    updateSong({ ...currentSong, sections: [...currentSong.sections, newSection] });
  };

  const removeSection = (sectionId: string) => {
    if (!currentSong) return;
    updateSong({ ...currentSong, sections: currentSong.sections.filter(s => s.id !== sectionId) });
  };

  const addChord = (sectionId: string) => {
    if (!currentSong) return;
    const newChord: ChordData = { id: crypto.randomUUID(), originalValue: 'C' };
    const newSections = currentSong.sections.map(s => 
      s.id === sectionId ? { ...s, chords: [...s.chords, newChord] } : s
    );
    updateSong({ ...currentSong, sections: newSections });
  };

  const updateChord = (sectionId: string, chordId: string, value: string) => {
    if (!currentSong) return;
    const newSections = currentSong.sections.map(s => 
      s.id === sectionId ? {
        ...s,
        chords: s.chords.map(c => c.id === chordId ? { ...c, originalValue: value } : c)
      } : s
    );
    updateSong({ ...currentSong, sections: newSections });
  };

  const removeChord = (sectionId: string, chordId: string) => {
    if (!currentSong) return;
    const newSections = currentSong.sections.map(s => 
      s.id === sectionId ? { ...s, chords: s.chords.filter(c => c.id !== chordId) } : s
    );
    updateSong({ ...currentSong, sections: newSections });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (!currentSong) return;
    const newSections = [...currentSong.sections];
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= newSections.length) return;
    [newSections[index], newSections[newIdx]] = [newSections[newIdx], newSections[index]];
    updateSong({ ...currentSong, sections: newSections });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(songs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chordmaster_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setSongs(prev => {
            const merged = [...prev];
            imported.forEach((s: Song) => {
              if (!merged.find(m => m.id === s.id)) {
                merged.push(s);
              }
            });
            return merged;
          });
          alert('Import successful!');
        }
      } catch (err) {
        alert('Failed to parse file. Ensure it is a valid ChordMaster JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar 
        songs={songs} 
        currentSongId={currentSongId} 
        onSelectSong={(id) => { setCurrentSongId(id); setCurrentView('editor'); }} 
        onCreateSong={handleCreateSong}
        onDeleteSong={handleDeleteSong}
        onExport={handleExport}
        onImport={() => fileInputRef.current?.click()}
        isDarkMode={isDarkMode}
      />
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImport} 
        className="hidden" 
        accept=".json"
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className={`p-4 border-b flex items-center justify-between z-20 ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white shadow-sm'}`}>
          <div className="flex items-center gap-4">
            <Music className="text-indigo-500" size={24} />
            <h1 className="text-xl font-bold tracking-tight">ChordMaster</h1>
            <nav className="ml-8 flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setCurrentView('editor')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${currentView === 'editor' ? 'bg-indigo-500 text-white shadow-lg' : 'opacity-60 hover:opacity-100'}`}
              >
                Editor
              </button>
              <button 
                onClick={() => setCurrentView('config')}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${currentView === 'config' ? 'bg-indigo-500 text-white shadow-lg' : 'opacity-60 hover:opacity-100'}`}
              >
                Library
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
               <button 
                  onClick={() => setVisualizerType('piano')}
                  className={`px-3 py-1 rounded transition-all flex items-center gap-2 ${visualizerType === 'piano' ? 'bg-indigo-500 text-white shadow-md' : 'opacity-50 hover:opacity-100'}`}
                  title="Piano View"
               >
                  <Keyboard size={16} />
               </button>
               <button 
                  onClick={() => setVisualizerType('guitar')}
                  className={`px-3 py-1 rounded transition-all flex items-center gap-2 ${visualizerType === 'guitar' ? 'bg-indigo-500 text-white shadow-md' : 'opacity-50 hover:opacity-100'}`}
                  title="Guitar View"
               >
                  <Layers size={16} />
               </button>
            </div>

            <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <button 
                onClick={() => setNotation('letter')}
                className={`px-3 py-1 rounded text-xs font-medium transition ${notation === 'letter' ? (isDarkMode ? 'bg-slate-700 shadow-sm text-white' : 'bg-white shadow-sm') : 'opacity-60'}`}
              >
                Letters
              </button>
              <button 
                onClick={() => setNotation('solfege')}
                className={`px-3 py-1 rounded text-xs font-medium transition ${notation === 'solfege' ? (isDarkMode ? 'bg-slate-700 shadow-sm text-white' : 'bg-white shadow-sm') : 'opacity-60'}`}
              >
                Solfège
              </button>
            </div>

            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all ${isDarkMode ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-gray-100 text-indigo-600'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {currentView === 'config' ? (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => setCurrentView('editor')} className="p-2 rounded-full hover:bg-indigo-500/10 text-indigo-500 transition">
                    <ArrowLeft size={24} />
                  </button>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Chord Reference</h2>
                    <p className="opacity-60 font-medium">Standard definitions with selectable root.</p>
                  </div>
                </div>
                {/* Root Selector for Library: One row */}
                <div className={`flex flex-nowrap gap-1 p-2 rounded-2xl overflow-x-auto no-scrollbar ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-gray-100 shadow-sm'}`}>
                   {NOTES.filter(n => !n.isBlack).map(n => (
                     <button 
                        key={n.index}
                        onClick={() => setLibraryRoot(n.index)}
                        className={`w-10 h-10 flex-shrink-0 rounded-lg text-xs font-bold transition-all ${libraryRoot === n.index ? 'bg-indigo-500 text-white shadow-lg scale-110' : 'hover:bg-indigo-500/10'}`}
                     >
                       {notation === 'letter' ? n.letter : n.solfege}
                     </button>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Object.entries(CHORD_INTERVALS).map(([suffix, info]) => (
                  <div key={suffix} className={`p-6 rounded-3xl border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
                    <div className="mb-6 h-40 flex items-center justify-center">
                       {visualizerType === 'piano' ? (
                         <Piano activeNotes={info.intervals.map(i => (libraryRoot + i) % 12)} isDarkMode={isDarkMode} variant="mini" />
                       ) : (
                         <Guitar chordName={`${NOTES[libraryRoot].letter}${suffix}`} isDarkMode={isDarkMode} variant="mini" />
                       )}
                    </div>
                    <div className="flex flex-col gap-0.5 border-t border-black/5 dark:border-white/5 pt-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-1">{info.name}</span>
                      <span className="text-2xl font-mono font-black text-center">
                        {notation === 'letter' ? NOTES[libraryRoot].letter : NOTES[libraryRoot].solfege}
                        {suffix || ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !currentSong ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-50">
              <Keyboard size={80} className="stroke-1 text-indigo-500" />
              <div>
                <h3 className="text-2xl font-bold">No Song Selected</h3>
                <p className="max-w-xs mx-auto">Start by creating a new song or selecting one from your library.</p>
              </div>
              <button onClick={handleCreateSong} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all hover:shadow-xl shadow-indigo-500/20 active:scale-95">
                New Song
              </button>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto pb-24">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-1 flex-1">
                  <input 
                    type="text" 
                    value={currentSong.title}
                    onChange={(e) => updateSong({ ...currentSong, title: e.target.value })}
                    className={`text-5xl font-black bg-transparent border-none outline-none focus:ring-0 w-full tracking-tight ${isDarkMode ? 'placeholder-slate-800' : 'placeholder-gray-200'}`}
                    placeholder="Untitled Song"
                  />
                  <input 
                    type="text" 
                    value={currentSong.author}
                    onChange={(e) => updateSong({ ...currentSong, author: e.target.value })}
                    className={`text-xl font-medium opacity-40 bg-transparent border-none outline-none focus:ring-0 w-full`}
                    placeholder="Artist Name"
                  />
                </div>

                <div className={`p-4 rounded-[2rem] flex items-center gap-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-gray-200 shadow-xl shadow-black/5'}`}>
                  <div className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] pl-2">Key Offset</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setTransposition(prev => prev - 1)} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-slate-800 bg-slate-950 border border-slate-800' : 'hover:bg-gray-100 bg-gray-50 border border-gray-200'}`}>
                      <ChevronDown size={16} />
                    </button>
                    <span className="w-8 text-center font-mono text-xl font-black text-indigo-500">
                      {transposition > 0 ? `+${transposition}` : transposition}
                    </span>
                    <button onClick={() => setTransposition(prev => prev + 1)} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-slate-800 bg-slate-950 border border-slate-800' : 'hover:bg-gray-100 bg-gray-50 border border-gray-200'}`}>
                      <ChevronUp size={16} />
                    </button>
                  </div>
                  <button onClick={() => setTransposition(0)} disabled={transposition === 0} className="text-xs font-bold text-indigo-500 hover:underline opacity-60 disabled:opacity-0 transition px-2">Reset</button>
                </div>
              </div>

              <div className="space-y-20">
                {currentSong.sections.map((section, sIdx) => (
                  <div key={section.id} className="relative group animate-in fade-in slide-in-from-bottom-2 duration-400">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="opacity-0 group-hover:opacity-100 transition-all flex flex-col">
                        <button onClick={() => moveSection(sIdx, 'up')} className="p-1 hover:text-indigo-500 transition-colors"><ChevronUp size={14}/></button>
                        <button onClick={() => moveSection(sIdx, 'down')} className="p-1 hover:text-indigo-500 transition-colors"><ChevronDown size={14}/></button>
                      </div>
                      <input 
                        type="text" 
                        value={section.name}
                        onChange={(e) => {
                          const newSections = [...currentSong.sections];
                          newSections[sIdx].name = e.target.value;
                          updateSong({ ...currentSong, sections: newSections });
                        }}
                        className={`font-black text-[11px] uppercase tracking-[0.4em] bg-transparent border-none outline-none focus:ring-0 text-indigo-500/60`}
                        placeholder="SECTION NAME"
                      />
                      <button onClick={() => removeSection(section.id)} className="opacity-0 group-hover:opacity-60 hover:opacity-100 p-1.5 text-red-500 transition-all bg-red-500/5 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {section.chords.map((chord) => {
                        const { rootIndex, quality } = parseChord(chord.originalValue);
                        const transposedValue = transposeChord(chord.originalValue, transposition, notation);
                        
                        return (
                          <div 
                            key={chord.id}
                            className={`group/chord relative flex flex-col p-4 pt-4 rounded-[2.5rem] transition-all duration-300 cursor-pointer h-64 ${selectedChordId === chord.id ? (isDarkMode ? 'bg-indigo-950/40 ring-2 ring-indigo-500 shadow-2xl scale-[1.02]' : 'bg-indigo-50 ring-2 ring-indigo-500 shadow-xl scale-[1.02]') : (isDarkMode ? 'bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900' : 'bg-white border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md')}`}
                            onClick={() => { setSelectedChordId(chord.id); setShowChordPicker(null); }}
                          >
                            <div className="mb-4 w-full h-24 pointer-events-none flex justify-center items-center">
                              {visualizerType === 'piano' ? (
                                <Piano activeNotes={getChordNotes(chord.originalValue, transposition)} isDarkMode={isDarkMode} variant="mini" />
                              ) : (
                                <Guitar chordName={transposeChord(chord.originalValue, transposition, 'letter')} isDarkMode={isDarkMode} variant="mini" />
                              )}
                            </div>
                            
                            {/* Transposed Chord (Bigger) */}
                            <div className="text-3xl font-black uppercase text-center tracking-tighter text-indigo-500 dark:text-indigo-400 mt-auto">
                              {transposedValue}
                            </div>

                            {/* Original Chord (Smaller Input) */}
                            <div className="relative mt-2 flex items-center justify-center gap-1.5">
                              <div className="text-[9px] font-black opacity-30 uppercase tracking-tighter">Org</div>
                              <input 
                                type="text"
                                value={chord.originalValue}
                                onChange={(e) => updateChord(section.id, chord.id, e.target.value)}
                                className="bg-transparent border-none outline-none focus:ring-0 text-center font-bold text-xs uppercase w-16 opacity-60 hover:opacity-100 focus:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <button 
                                onClick={(e) => { e.stopPropagation(); setShowChordPicker(showChordPicker === chord.id ? null : chord.id); }}
                                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 opacity-40 hover:opacity-100 transition-all ml-1"
                                title="Pick Chord"
                              >
                                <ListFilter size={14} />
                              </button>
                            </div>

                            {/* Chord Picker Popover: Dropping down from the filter button */}
                            {showChordPicker === chord.id && (
                              <div 
                                className={`absolute top-full left-0 mt-2 w-64 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 p-4 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-100'}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="grid grid-cols-2 gap-4 h-64">
                                  <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1">
                                    <div className="text-[8px] font-black opacity-30 mb-2 px-1 tracking-widest uppercase">Root</div>
                                    {NOTES.map(n => (
                                      <button 
                                        key={n.index}
                                        onClick={() => {
                                          updateChord(section.id, chord.id, `${n.letter}${quality}`);
                                        }}
                                        className={`px-3 py-2 rounded-xl text-[11px] font-bold text-left transition ${chord.originalValue.startsWith(n.letter) ? 'bg-indigo-500 text-white shadow-lg' : 'hover:bg-indigo-500/10'}`}
                                      >
                                        {notation === 'letter' ? n.letter : n.solfege}
                                      </button>
                                    ))}
                                  </div>
                                  <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-1 border-l dark:border-slate-700 pl-2">
                                    <div className="text-[8px] font-black opacity-30 mb-2 px-1 tracking-widest uppercase">Quality</div>
                                    {Object.keys(CHORD_INTERVALS).map(q => (
                                      <button 
                                        key={q}
                                        onClick={() => {
                                          const { originalRoot } = parseChord(chord.originalValue);
                                          updateChord(section.id, chord.id, `${originalRoot}${q}`);
                                        }}
                                        className={`px-3 py-2 rounded-xl text-[11px] font-bold text-left transition ${quality === q ? 'bg-indigo-500 text-white shadow-lg' : 'hover:bg-indigo-500/10'}`}
                                      >
                                        {q || 'Maj'}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <button 
                                  onClick={() => setShowChordPicker(null)}
                                  className="w-full mt-4 py-3 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-indigo-600 transition shadow-xl shadow-indigo-500/30"
                                >
                                  Close
                                </button>
                              </div>
                            )}
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                removeChord(section.id, chord.id);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-xl opacity-0 group-hover/chord:opacity-100 hover:scale-110 transition duration-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                      <button 
                        onClick={() => addChord(section.id)}
                        className={`flex flex-col items-center justify-center h-64 rounded-[2.5rem] border-2 border-dashed transition-all active:scale-95 ${isDarkMode ? 'border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/5' : 'border-gray-200 hover:border-indigo-500 hover:bg-white'}`}
                      >
                        <Plus size={32} className="opacity-20" />
                        <span className="text-[10px] font-black opacity-20 uppercase tracking-[0.2em] mt-2">New Chord</span>
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={addSection}
                  className={`w-full py-12 border-2 border-dashed rounded-[3.5rem] flex items-center justify-center gap-4 transition-all hover:bg-indigo-500/5 active:scale-[0.98] ${isDarkMode ? 'border-slate-800 text-slate-600 hover:border-indigo-500 hover:text-indigo-500' : 'border-gray-200 text-gray-400 hover:border-indigo-500 hover:text-indigo-500'}`}
                >
                  <Plus size={24} />
                  <span className="font-black tracking-[0.5em] uppercase text-xs">Append Section</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`mt-auto border-t transition-colors z-10 ${isDarkMode ? 'bg-slate-900/98 backdrop-blur-3xl border-slate-800 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]' : 'bg-white/95 backdrop-blur-3xl border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]'}`}>
          <div className="max-w-6xl mx-auto p-10 flex flex-col items-center">
            {visualizerType === 'piano' ? (
              <Piano activeNotes={activeChordNotes} isDarkMode={isDarkMode} variant="full" />
            ) : (
              <Guitar chordName={transposeChord(activeChordName, transposition, 'letter')} isDarkMode={isDarkMode} variant="full" />
            )}
            <div className="flex items-center justify-center mt-8 gap-10">
               <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.4em] opacity-30">
                 <Info size={16} className="text-indigo-500" />
                 Global {visualizerType.charAt(0).toUpperCase() + visualizerType.slice(1)} Feed
               </div>
               {selectedChordId && (
                 <div className="px-6 py-2 rounded-full bg-indigo-500 text-[11px] font-black text-white uppercase tracking-widest animate-pulse shadow-2xl shadow-indigo-500/40">
                   {transposeChord(activeChordName, transposition, notation)} Focused
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
