
import React from 'react';
import { Song } from '../types';
import { Plus, Trash2, FileText, Calendar, Music, Download, Upload } from 'lucide-react';

interface SidebarProps {
  songs: Song[];
  currentSongId: string | null;
  onSelectSong: (id: string) => void;
  onCreateSong: () => void;
  onDeleteSong: (id: string) => void;
  onExport: () => void;
  onImport: () => void;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  songs, 
  currentSongId, 
  onSelectSong, 
  onCreateSong, 
  onDeleteSong,
  onExport,
  onImport,
  isDarkMode
}) => {
  return (
    <aside className={`w-72 flex flex-col border-r transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
      <div className="p-6 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest opacity-50">Your Library</h2>
        <div className="flex gap-1">
          <button 
            onClick={onCreateSong}
            className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            title="New Song"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-6">
        {songs.length === 0 ? (
          <div className="mt-8 text-center px-4 space-y-3">
             <div className="mx-auto w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center opacity-40">
                <FileText size={20} />
             </div>
             <p className="text-xs opacity-40 leading-relaxed">No songs found. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {[...songs].sort((a, b) => b.lastModified - a.lastModified).map((song) => (
              <div 
                key={song.id}
                onClick={() => onSelectSong(song.id)}
                className={`
                  group relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                  ${currentSongId === song.id 
                    ? (isDarkMode ? 'bg-slate-800 text-slate-50' : 'bg-white shadow-sm ring-1 ring-black/5 text-gray-900') 
                    : (isDarkMode ? 'hover:bg-slate-800/50 text-slate-400' : 'hover:bg-gray-200/50 text-gray-600')
                  }
                `}
              >
                <div className={`p-2 rounded-lg ${currentSongId === song.id ? 'bg-indigo-500 text-white' : (isDarkMode ? 'bg-slate-800' : 'bg-gray-200')}`}>
                  <Music size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate">{song.title}</h4>
                  <p className="text-[10px] opacity-60 truncate font-medium uppercase tracking-wider">{song.author}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSong(song.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500/50 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`mt-auto p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
        <div className="flex gap-2 mb-4">
           <button 
             onClick={onExport}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}
           >
             <Download size={14} /> Export
           </button>
           <button 
             onClick={onImport}
             className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'}`}
           >
             <Upload size={14} /> Import
           </button>
        </div>
        <div className="text-[10px] opacity-30 flex items-center gap-2">
          <Calendar size={10} />
          <span>Local Storage Active</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
