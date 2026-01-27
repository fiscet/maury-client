'use client';

import { useState } from 'react';
import { uploadDocument } from '@/services/storage';
import { X, Upload, Calendar, FilePlus, Loader2 } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: (fileData: any) => void;
}

export default function UploadModal({
  onClose,
  onUploadSuccess
}: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('01');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      // In a real app we'd get this from auth context
      const {
        data: { user }
      } = await (await import('@/utils/supabase/client'))
        .createClient()
        .auth.getUser();
      if (!user) throw new Error('User not found');

      const result = await uploadDocument(file, user.id, year, month);
      onUploadSuccess(result);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Errore durante il caricamento. Riprova.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-12 border border-slate-100 animate-in zoom-in-95 duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-5 mb-10">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm shadow-primary/5">
            <Upload className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic leading-tight">
              Carica File
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Archivia un nuovo documento nel tuo portale.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 mb-8 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm font-bold flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            {error}
          </div>
        )}

        <div className="space-y-8">
          <div className="space-y-4">
            <label className="label-premium">Periodo di Riferimento</label>
            <div className="flex gap-4">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="input-premium h-14 !py-0 flex-1 appearance-none bg-white font-bold"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="input-premium h-14 !py-0 flex-1 appearance-none bg-white font-bold"
              >
                <option value="01">Gennaio</option>
                <option value="02">Febbraio</option>
                <option value="03">Marzo</option>
                <option value="04">Aprile</option>
                <option value="05">Maggio</option>
                <option value="06">Giugno</option>
                <option value="07">Luglio</option>
                <option value="08">Agosto</option>
                <option value="09">Settembre</option>
                <option value="10">Ottobre</option>
                <option value="11">Novembre</option>
                <option value="12">Dicembre</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="label-premium">Scegli il Documento</label>
            <div className="relative group">
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf,image/*"
                capture="environment"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="input-premium flex items-center gap-4 py-8 border-dashed border-2 group-hover:border-primary transition-colors text-slate-500 group-hover:text-primary">
                <FilePlus className="w-6 h-6" />
                <span className="font-bold truncate">
                  {file ? file.name : 'Seleziona PDF o Immagine...'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-50">
            <button
              type="button"
              className="flex-1 px-8 py-5 bg-slate-50 text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 hover:text-slate-700 transition-all active:scale-[0.97]"
              onClick={onClose}
              disabled={uploading}
            >
              Annulla
            </button>
            <button
              onClick={handleUpload}
              className="flex-1 btn-premium py-5 !rounded-2xl shadow-xl shadow-primary/10"
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  CARICAMENTO...
                </>
              ) : (
                'CARICA FILE'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
