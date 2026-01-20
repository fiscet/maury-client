import React, { useState } from 'react';
import { Note } from '../types';
import { X, Send, MessageSquare, Clock, User } from 'lucide-react';

export interface SharedNotesModalProps {
  documentName: string;
  onClose: () => void;
  notes: Note[];
  onSend: (content: string) => void;
  loading: boolean;
}

export function NotesModalUI({ documentName, onClose, notes, onSend, loading }: SharedNotesModalProps) {
  const [newNote, setNewNote] = useState('');

  const handleSendClick = () => {
    if (newNote.trim()) {
      onSend(newNote);
      setNewNote('');
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl flex flex-col h-[80vh] border border-slate-100 animate-in zoom-in-95 duration-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight italic leading-tight">Note Documento</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px] md:max-w-xs">{documentName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Caricamento...</p>
            </div>
          ) : (
            notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3">
                <MessageSquare className="w-12 h-12 opacity-20" />
                <p className="text-sm font-medium italic">Nessuna nota presente per questo file.</p>
              </div>
            ) : (
              notes.map(note => (
                <div key={note.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      {new Date(note.created_at).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      <User className="w-2.5 h-2.5" />
                      Autore
                    </div>
                  </div>
                  <div className="text-sm text-slate-800 leading-relaxed font-medium">{note.content}</div>
                </div>
              ))
            )
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-slate-100 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              className="input-premium h-12"
              placeholder="Scrivi una nota o un aggiornamento..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendClick()}
            />
            <button
              className="btn-premium w-14 h-12 px-0 shrink-0"
              onClick={handleSendClick}
              disabled={!newNote.trim()}
              title="Invia"
            >
              <Send className="w-5 h-5 translate-x-0.5 -translate-y-0.5 rotate-[-15deg]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
