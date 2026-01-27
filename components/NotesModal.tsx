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

export default function NotesModal({
  documentId,
  documentName,
  onClose
}: NotesModalProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createClient();

  const fetchNotes = async () => {
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

  useEffect(() => {
    // Auth Check
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });

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
      subscription.unsubscribe();
    };
  }, [documentId]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('maury_document_notes').insert({
      document_id: documentId,
      content: content,
      author_id: user.id
    });

    if (!error) {
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
        handleSend(content);
      }}
      loading={loading}
      currentUserId={currentUserId}
    />
  );
}
