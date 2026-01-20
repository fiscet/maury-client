'use client';

import {
  FileText,
  Download,
  MessageSquare,
  Calendar,
  HardDrive
} from 'lucide-react';

interface FileItemProps {
  name: string;
  date: string;
  size: string;
  status: 'read' | 'unread';
  type: 'pdf' | 'image';
  notesCount?: number;
  onOpenNotes: () => void;
  onDownload: () => void;
}

export default function FileItem({ name, date, size, status, type, notesCount = 0, onOpenNotes, onDownload }: FileItemProps) {
  return (
    <div className="p-6 hover:bg-slate-50/80 transition-colors group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <FileText className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{name}</div>
          <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              {size}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={onOpenNotes}
          className="flex-1 sm:flex-none relative p-3 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
          title="Note"
        >
          <MessageSquare className="w-6 h-6 mx-auto" />
          {notesCount > 0 && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
              {notesCount}
            </span>
          )}
        </button>
        <button
          onClick={onDownload}
          className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-primary transition-all shadow-sm active:scale-[0.97] flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Scarica
        </button>
      </div>
    </div>
  );
}
