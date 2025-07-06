import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import './App.css'

function App() {
  const [tabs, setTabs] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '' })
  const [activeTab, setActiveTab] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedActiveTab = localStorage.getItem('notes-app-active-tab')
    const savedTheme = localStorage.getItem('notes-app-theme')
    
    // Load each tab individually for better performance
    const loadedTabs = {}
    for (let i = 1; i <= 10; i++) {
      const key = i === 1 ? 'notes-app-content' : `notes-app-content-${i}`
      const savedContent = localStorage.getItem(key)
      loadedTabs[i] = savedContent || ''
    }
    
    setTabs(loadedTabs)
    
    if (savedActiveTab) {
      setActiveTab(parseInt(savedActiveTab))
    }
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
    }
  }, [])


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
      // Check if any tab has unsaved changes
      const hasUnsavedChanges = Object.keys(tabs).some(tabNumber => {
        const key = parseInt(tabNumber) === 1 ? 'notes-app-content' : `notes-app-content-${tabNumber}`
        const savedContent = localStorage.getItem(key) || ''
        return tabs[tabNumber] !== savedContent
      })
      
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [tabs])

  const handleNotesChange = (e) => {
    const newContent = e.target.value
    setTabs(prev => ({ ...prev, [activeTab]: newContent }))
    
    // Save immediately - just this tab
    const key = activeTab === 1 ? 'notes-app-content' : `notes-app-content-${activeTab}`
    localStorage.setItem(key, newContent)
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
