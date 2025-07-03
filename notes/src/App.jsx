import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import './App.css'

function App() {
  const [notes, setNotes] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes-app-content')
    const savedTheme = localStorage.getItem('notes-app-theme')
    
    if (savedNotes) {
      setNotes(savedNotes)
    }
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    if (notes !== localStorage.getItem('notes-app-content')) {
      localStorage.setItem('notes-app-content', notes)
      setHasUnsavedChanges(false)
    }
  }, [notes])

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('notes-app-theme', isDarkMode ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // Prevent browser tab closing when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const currentNotes = localStorage.getItem('notes-app-content')
      if (notes !== currentNotes) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [notes])

  const handleNotesChange = (e) => {
    setNotes(e.target.value)
    setHasUnsavedChanges(true)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="app">
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      
      <textarea
        className="notes-textarea"
        value={notes}
        onChange={handleNotesChange}
        placeholder="Start writing your notes..."
        autoFocus
      />
    </div>
  )
}

export default App
