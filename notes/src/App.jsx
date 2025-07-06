import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import './App.css'

function App() {
  const [tabs, setTabs] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '' })
  const [activeTab, setActiveTab] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes-app-content')
    const savedTabs = localStorage.getItem('notes-app-tabs')
    const savedActiveTab = localStorage.getItem('notes-app-active-tab')
    const savedTheme = localStorage.getItem('notes-app-theme')
    
    // Handle backwards compatibility - migrate old single note to tab 1
    if (savedNotes && !savedTabs) {
      const newTabs = { 1: savedNotes, 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '' }
      setTabs(newTabs)
      localStorage.setItem('notes-app-tabs', JSON.stringify(newTabs))
      localStorage.removeItem('notes-app-content') // Clean up old key
    } else if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs)
        setTabs(parsedTabs)
      } catch (e) {
        console.error('Error parsing saved tabs:', e)
      }
    }
    
    if (savedActiveTab) {
      setActiveTab(parseInt(savedActiveTab))
    }
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
    }
  }, [])

  // Save to localStorage whenever tabs or active tab change
  useEffect(() => {
    localStorage.setItem('notes-app-tabs', JSON.stringify(tabs))
  }, [tabs])

  useEffect(() => {
    localStorage.setItem('notes-app-active-tab', activeTab.toString())
  }, [activeTab])

  useEffect(() => {
    localStorage.setItem('notes-app-theme', isDarkMode ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // Prevent browser tab closing when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const currentTabs = localStorage.getItem('notes-app-tabs')
      if (JSON.stringify(tabs) !== currentTabs) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [tabs])

  const handleNotesChange = (e) => {
    setTabs(prev => ({
      ...prev,
      [activeTab]: e.target.value
    }))
  }

  const switchTab = (tabNumber) => {
    setActiveTab(tabNumber)
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
        value={tabs[activeTab]}
        onChange={handleNotesChange}
        placeholder={`Start writing your notes in tab ${activeTab}...`}
        autoFocus
      />
      
      <div className="tab-panel">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(tabNumber => (
          <button
            key={tabNumber}
            className={`tab-button ${activeTab === tabNumber ? 'active' : ''}`}
            onClick={() => switchTab(tabNumber)}
          >
            {tabNumber}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
