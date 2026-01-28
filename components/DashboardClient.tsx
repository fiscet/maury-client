'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FileItem from './FileItem';
import UploadScreen from './UploadScreen';
import NotesModal from './NotesModal';
import { Document } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { Settings, Plus, FileText, Calendar, RefreshCw } from 'lucide-react';

export default function DashboardClient({
  initialDocuments
}: {
  initialDocuments: Document[];
}) {
  const [documents, setDocuments] = useState<Document[]>(
    initialDocuments.map((doc) => ({
      ...doc,
      notesCount: 0
    }))
  );

  const currentYear = new Date().getFullYear();
  const [yearFilter, setYearFilter] = useState(currentYear.toString());
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedNoteDoc, setSelectedNoteDoc] = useState<Document | null>(null);

  useEffect(() => {
    const fetchNoteCounts = async () => {
      const supabase = createClient();
      const docIds = initialDocuments.map((d) => d.id);
      if (docIds.length === 0) return;

      const { data, error } = await supabase
        .from('maury_document_notes')
        .select('document_id')
        .in('document_id', docIds);

      if (data) {
        const counts: Record<string, number> = {};
        data.forEach((note: { document_id: string }) => {
          counts[note.document_id] = (counts[note.document_id] || 0) + 1;
        });

        setDocuments((prevDocs) =>
          prevDocs.map((doc) => ({
            ...doc,
            notesCount: counts[doc.id] || 0
          }))
        );
      }
    };

    fetchNoteCounts();
  }, [initialDocuments]);

  const updateCountFor = async (docId: string) => {
    const supabase = createClient();
    const { count } = await supabase
      .from('maury_document_notes')
      .select('*', { count: 'exact', head: true })
      .eq('document_id', docId);

    if (count !== null) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, notesCount: count } : d))
      );
    }
  };

  const handleRefresh = async () => {
    window.location.reload();
  };

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = (newRecord: Document) => {
    const newDoc: Document = {
      ...newRecord,
      notesCount: 0
    };
    setDocuments([newDoc, ...documents]);
    setIsUploadModalOpen(false);
  };

  const handleOpenNotes = (doc: Document) => {
    setSelectedNoteDoc(doc);
  };

  const handleDownload = async (doc: Document) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(doc.file_path, 60);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (e) {
      console.error(e);
      alert('Errore download');
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    return doc.year === yearFilter;
  });

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Main Content */}
      <div
        className={`space-y-8 animate-in fade-in duration-700 p-6 md:p-8 transition-transform duration-500 ease-in-out ${
          isUploadModalOpen
            ? 'transform -translate-x-full opacity-50'
            : 'opacity-100'
        }`}
      >
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic">
              I Miei Documenti
            </h2>
            <p className="text-slate-500 font-medium">
              Visualizza e gestisci i tuoi file archiviati.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              title="Aggiorna App"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <Settings className="w-4 h-4" />
              Profilo
            </Link>
            <button
              onClick={handleUploadClick}
              className="btn-premium flex items-center gap-2 group !py-4"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              CARICA FILE
            </button>
          </div>
        </div>

        {selectedNoteDoc && (
          <NotesModal
            documentId={selectedNoteDoc.id}
            documentName={selectedNoteDoc.name}
            onClose={() => {
              const id = selectedNoteDoc.id;
              setSelectedNoteDoc(null);
              updateCountFor(id);
            }}
          />
        )}

        {/* Main List Area */}
        <div className="card-premium p-0 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div className="relative w-full md:w-64 group">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="input-premium pl-14 h-14 !py-0 appearance-none bg-white font-bold"
              >
                <option value={currentYear}>Anno {currentYear}</option>
                <option value={currentYear - 1}>Anno {currentYear - 1}</option>
              </select>
              <Calendar className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="flex items-center gap-6 px-4">
              <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  Documenti
                </p>
                <p className="text-xl font-black text-slate-900 leading-none">
                  {filteredDocuments.length}
                </p>
              </div>
            </div>
          </div>

          {/* Document List */}
          <div className="divide-y divide-slate-50">
            {filteredDocuments.map((doc) => (
              <FileItem
                key={doc.id}
                name={doc.name}
                date={`${doc.month}/${doc.year}`}
                size={doc.size}
                status={doc.status}
                type={doc.type}
                notesCount={doc.notesCount}
                onOpenNotes={() => handleOpenNotes(doc)}
                onDownload={() => handleDownload(doc)}
              />
            ))}

            {filteredDocuments.length === 0 && (
              <div className="px-8 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <FileText className="w-12 h-12 text-slate-200" />
                  <p className="text-slate-400 font-medium italic">
                    Nessun documento trovato.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Screen - Slide In */}
      <div
        className={`absolute inset-0 w-full h-full bg-white z-20 transition-transform duration-500 ease-in-out transform ${
          isUploadModalOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <UploadScreen
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      </div>
    </div>
  );
}
