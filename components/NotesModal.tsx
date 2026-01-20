'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Use client-side client
import { Note } from '@/types';
import { NotesModalUI } from './NotesModalUI';

interface NotesModalProps {
  documentId: string;
  documentName: string;
  onClose: () => void;
}

export default function NotesModal({ documentId, documentName, onClose }: NotesModalProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchNotes();

    // Realtime Subscription
    const channel = supabase
      .channel('realtime-notes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'maury_document_notes',
          filter: `document_id=eq.${documentId}`
        },
        (payload) => {
          // Append new note if it belongs to this doc (already filtered)
          const newMsg = payload.new as Note;
          setNotes((currentNotes) => [...currentNotes, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [documentId]);

  const fetchNotes = async () => {
    // setLoading(true); // Don't show loading on refetch if we keep previous notes, or only on first load
    // Actually simpler to just load once.
    if (notes.length === 0) setLoading(true);

    const { data, error } = await supabase
      .from('maury_document_notes')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: true });

    if (data) {
      setNotes(data);
    }
    setLoading(false);
  };

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('maury_document_notes')
      .insert({
        document_id: documentId,
        content: content,
        author_id: user.id
      });

    if (!error) {
      // Input clearing is handled by UI component usually, but since we manage state here?
      // Actually UI component manages 'newNote' state internally now.
      fetchNotes();
    } else {
      console.error(error);
      alert('Errore invio nota');
    }
  };

  return (
    <NotesModalUI
      documentName={documentName}
      onClose={onClose}
      notes={notes}
      onSend={(content) => {
        // The original instruction included setNewNote(content) here,
        // but since newNote state is removed and handleSend now takes content directly,
        // we just call handleSend with the content.
        handleSend(content);
      }}
      loading={loading}
    />
  );
}
