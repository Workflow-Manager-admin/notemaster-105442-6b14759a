import React, { useState, useEffect, useRef } from 'react';
import './App.css';

/**
 * Notes Frontend App
 * - Modern, minimalistic, light theme
 * - Features: Create, edit, delete, and view notes
 * - Layout: Top nav, left sidebar (notes list), main editor/details panel
 * - Responsive design, custom theming via CSS variables, in-localStorage persistence
 */

// PUBLIC_INTERFACE
function App() {
  // --- Main App State ---
  const [theme, setTheme] = useState('light');
  const [notes, setNotes] = useState(() => {
    // Load notes from localStorage on first render.
    const saved = localStorage.getItem('notes-app__notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedId, setSelectedId] = useState(() => {
    // Loads last selected note or none.
    const saved = localStorage.getItem('notes-app__selectedId');
    return saved ? saved : '';
  });
  const [search, setSearch] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editingId, setEditingId] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const titleInputRef = useRef(null);

  // App color palette (CSS variables)
  const COLORS = {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#FFC107',
    lightBackground: '#f8f9fa'
  };

  // --- Effects ---
  // Set theme CSS variable on load/theme change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist notes and selected note to localStorage on any notes updates
  useEffect(() => {
    localStorage.setItem('notes-app__notes', JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem('notes-app__selectedId', selectedId ?? '');
  }, [selectedId]);

  // When a note is selected, update editor view
  useEffect(() => {
    if (!selectedId) {
      setEditTitle('');
      setEditBody('');
      setEditingId('');
      return;
    }
    const n = notes.find(n => n.id === selectedId);
    if (n) {
      setEditTitle(n.title);
      setEditBody(n.body);
      setEditingId(n.id);
    }
  }, [selectedId, notes]);

  // Responsively close sidebar on narrow screens
  useEffect(() => {
    const handler = () => setSidebarOpen(window.innerWidth > 640);
    handler(); // initial
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // -- Utility functions --
  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }

  // PUBLIC_INTERFACE
  function createNote() {
    const newId = Date.now().toString();
    const newNote = {
      id: newId,
      title: 'Untitled Note',
      body: '',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    setSelectedId(newId);
    setTimeout(() => {
      setEditTitle('Untitled Note');
      setEditBody('');
      setEditingId(newId);
      titleInputRef.current && titleInputRef.current.focus();
    }, 100);
  }

  // PUBLIC_INTERFACE
  function selectNote(id) {
    setSelectedId(id);
  }

  // PUBLIC_INTERFACE
  function onEditTitle(e) {
    setEditTitle(e.target.value);
  }
  // PUBLIC_INTERFACE
  function onEditBody(e) {
    setEditBody(e.target.value);
  }

  // PUBLIC_INTERFACE
  function saveNote() {
    // Only save if editing something
    if (!editingId || (!editTitle.trim() && !editBody.trim())) return;
    setNotes(prev =>
      prev.map(n =>
        n.id === editingId
          ? { ...n, title: editTitle || 'Untitled Note', body: editBody, updated: new Date().toISOString() }
          : n
      )
    );
  }

  // PUBLIC_INTERFACE
  function deleteNote(id) {
    if (window.confirm('Delete this note?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
      // If deleting selected, select first or none
      if (selectedId === id) {
        const remaining = notes.filter(n => n.id !== id);
        setSelectedId(remaining.length > 0 ? remaining[0].id : '');
      }
    }
  }

  // PUBLIC_INTERFACE
  function filteredNotes() {
    const query = search.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter(
      n =>
        n.title.toLowerCase().includes(query) ||
        n.body.toLowerCase().includes(query)
    );
  }

  // PUBLIC_INTERFACE
  function handleSidebarCollapse() {
    setSidebarOpen(open => !open);
  }

  // -- Rendering Layout Components --

  // PUBLIC_INTERFACE
  function Navbar() {
    return (
      <nav style={{
        background: COLORS.primary,
        color: '#fff',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        zIndex: 100
      }}>
        <span style={{
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '1px'
        }}>Notemaster</span>
        <div>
          <button
            onClick={toggleTheme}
            style={{
              background: COLORS.secondary,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '7px 16px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 15,
              marginRight: 8
            }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button
            onClick={createNote}
            style={{
              background: COLORS.accent,
              color: COLORS.secondary,
              border: 'none',
              borderRadius: 6,
              padding: '7px 16px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 15
            }}
          >+ New Note</button>
        </div>
      </nav>
    );
  }

  // PUBLIC_INTERFACE
  function Sidebar() {
    return (
      <aside style={{
        width: 260,
        background: '#fff',
        borderRight: `1px solid ${COLORS.primary}22`,
        height: 'calc(100vh - 56px)',
        overflowY: 'auto',
        padding: '0.5rem 0 2rem 0',
        transition: 'all 0.2s',
        position: 'relative'
      }}>
        <div style={{
          padding: '0 1rem 0.5rem 1rem',
          display: 'flex',
          alignItems: 'center'
        }}>
          <input
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              border: `1px solid ${COLORS.primary}55`,
              borderRadius: 6,
              padding: '6px 8px',
              fontSize: 15,
              background: COLORS.lightBackground
            }}
            aria-label="Search notes"
          />
        </div>
        {filteredNotes().length === 0 && (
          <div style={{ color: '#888', padding: '1rem', fontSize: 15, textAlign: 'center' }}>
            No notes found.
          </div>
        )}
        <ul style={{
          listStyle: 'none',
          margin: 0,
          padding: 0
        }}>
          {filteredNotes().map(note => (
            <li key={note.id}
              style={{
                background: selectedId === note.id ? COLORS.primary + '18' : 'transparent',
                margin: '2px 0',
              }}>
              <button
                className="sidebar-note"
                onClick={() => selectNote(note.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  padding: '12px 1rem 12px 1.25rem',
                  background: 'transparent',
                  color: COLORS.secondary,
                  outline: 'none',
                  fontWeight: 600,
                  fontSize: 16,
                  borderLeft: selectedId === note.id ? `4px solid ${COLORS.primary}` : '4px solid transparent',
                  borderRadius: '0 6px 6px 0',
                  cursor: 'pointer',
                  transition: 'background .2s'
                }}
                aria-current={selectedId === note.id}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <span
                    style={{
                      color: COLORS.primary,
                      fontWeight: 700,
                      marginRight: 6,
                      fontSize: 18
                    }}
                  >📝</span>
                  {note.title && note.title.length > 30
                    ? note.title.slice(0, 28) + '…'
                    : note.title}
                </div>
                <span style={{
                  display: 'block',
                  color: '#888',
                  fontSize: 13,
                  fontWeight: 400,
                  marginTop: 1,
                  paddingLeft: 30
                }}>
                  {note.body && note.body.length > 48
                    ? note.body.slice(0, 46) + '…'
                    : note.body}
                </span>
                <span style={{
                  float: "right",
                  fontSize: 11,
                  color: '#bbb',
                  marginRight: 2
                }}>
                  {new Date(note.updated).toLocaleDateString()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    );
  }

  // PUBLIC_INTERFACE
  function EditorPanel() {
    if (!editingId) {
      return (
        <div style={{
          width: "100%",
          height: "100%",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#aaa',
          fontSize: 20,
        }}>
          <span>Select a note or create a new one!</span>
        </div>
      );
    }
    return (
      <form
        onSubmit={e => { e.preventDefault(); saveNote(); }}
        style={{
          width: '100%',
          maxWidth: 680,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          padding: '2rem 1.5rem 1.5rem 1.5rem'
        }}
      >
        <input
          ref={titleInputRef}
          style={{
            fontSize: 24,
            fontWeight: 700,
            border: `1px solid ${COLORS.primary}55`,
            borderRadius: 6,
            padding: 8,
            marginBottom: 6,
            background: 'rgba(255,255,255,0.87)',
            color: COLORS.secondary
          }}
          value={editTitle}
          onChange={onEditTitle}
          placeholder="Title"
          aria-label="Note title"
          maxLength={120}
          required
        />
        <textarea
          style={{
            fontSize: 16,
            border: `1px solid ${COLORS.primary}33`,
            borderRadius: 6,
            padding: 8,
            minHeight: 220,
            maxHeight: 460,
            resize: 'vertical',
            fontFamily: 'inherit',
            background: 'rgba(255,255,255,0.87)',
            color: COLORS.secondary
          }}
          value={editBody}
          onChange={onEditBody}
          placeholder="Write your note here…"
          aria-label="Note body"
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <button
            type="submit"
            style={{
              background: COLORS.primary,
              color: '#fff',
              border: 'none',
              padding: '9px 24px',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              marginRight: 10
            }}
          >💾 Save</button>
          <button
            style={{
              background: COLORS.accent,
              color: COLORS.secondary,
              border: 'none',
              padding: '9px 20px',
              borderRadius: 6,
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer',
              marginRight: 22
            }}
            onClick={e => { e.preventDefault(); createNote(); }}
            type="button"
          >+ New</button>
          <button
            style={{
              background: COLORS.secondary,
              color: '#fff',
              border: 'none',
              padding: '9px 18px',
              borderRadius: 6,
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer'
            }}
            onClick={e => { e.preventDefault(); deleteNote(editingId); }}
            type="button"
          >🗑 Delete</button>
          <span style={{
            marginLeft: 'auto',
            color: '#aaa',
            fontSize: 12,
            justifySelf: 'flex-end'
          }}>
            Updated: {new Date(notes.find(n=>n.id===editingId)?.updated).toLocaleString()}
          </span>
        </div>
      </form>
    );
  }

  // --- Responsive Layout ---
  return (
    <div style={{
      background: COLORS.lightBackground,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Inter","Segoe UI",Arial,sans-serif'
    }}>
      <Navbar />
      {/* Layout: Sidebar + Main Panel */}
      <div style={{
        display: 'flex',
        flex: 1,
        minHeight: 'calc(100vh - 56px)',
        overflow: 'hidden'
      }}>
        {/* Responsive Sidebar */}
        <div
          style={{
            minWidth: isSidebarOpen ? 250 : 0,
            width: isSidebarOpen ? 260 : 0,
            transition: 'width 0.22s',
            overflow: isSidebarOpen ? 'auto' : 'hidden',
            background: '#fff',
            borderRight: isSidebarOpen ? `1px solid ${COLORS.primary}22` : 'none',
            position: 'relative'
          }}
        >
          {/* Collapse/Expand Sidebar Toggle */}
          <button
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            style={{
              position: 'absolute',
              right: -19,
              top: 50,
              width: 28,
              height: 28,
              background: COLORS.primary,
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: window.innerWidth < 640 ? 'block' : 'none',
              zIndex: 2,
              fontSize: 17,
              boxShadow: '0 2px 8px rgb(0 0 0 / 10%)'
            }}
            onClick={handleSidebarCollapse}
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
          {isSidebarOpen && <Sidebar />}
        </div>
        {/* Main Editor/View Panel */}
        <main
          style={{
            flex: 1,
            minHeight: 0,
            background: COLORS.lightBackground,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start'
          }}
        >
          <EditorPanel />
        </main>
      </div>
      {/* Minimalist Footer */}
      <footer style={{
        height: 38,
        padding: 0,
        fontSize: 14,
        color: COLORS.secondary,
        background: '#fff',
        borderTop: `1px solid ${COLORS.primary}11`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.66
      }}>
        &copy; {new Date().getFullYear()} Notemaster &middot; Minimal Notes App
      </footer>
    </div>
  );
}

export default App;
