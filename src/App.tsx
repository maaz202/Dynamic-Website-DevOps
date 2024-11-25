import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, RefreshCw, MessageSquarePlus } from 'lucide-react';

interface Note {
  id: number;
  content: string;
  created_at: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const response = await fetch('http://localhost:3000/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote }),
      });
      const data = await response.json();
      setNotes([data, ...notes]);
      setNewNote('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/notes/${id}`, {
        method: 'DELETE',
      });
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <MessageSquarePlus className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Quick Notes</h1>
          <p className="text-gray-600">Your thoughts, captured instantly</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your note here..."
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Add Note
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No notes yet. Start by adding one above!
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start gap-4">
                  <p className="text-gray-800 flex-1">{note.content}</p>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {new Date(note.created_at).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;