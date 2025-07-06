import { useState, useEffect } from 'react'
import { Moon, Sun, Plus, Minus } from 'lucide-react'
import './App.css'

function App() {
  const [tabs, setTabs] = useState({ 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '' })
  const [activeTab, setActiveTab] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [fontSize, setFontSize] = useState(16)

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedActiveTab = localStorage.getItem('notes-app-active-tab')
    const savedTheme = localStorage.getItem('notes-app-theme')
    const savedFontSize = localStorage.getItem('notes-app-font-size')
    
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
    
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize))
    }
  }, [])


  // Don't save activeTab on mount, only when user changes it

  useEffect(() => {
    localStorage.setItem('notes-app-theme', isDarkMode ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem('notes-app-font-size', fontSize.toString())
  }, [fontSize])

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
    localStorage.setItem('notes-app-active-tab', tabNumber.toString())
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 36))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10))
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
        style={{ fontSize: `${fontSize}px` }}
      />
      
      <div className="tab-panel">
        <div className="tab-buttons">
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
        <div className="font-controls">
          <button
            className="font-control-button"
            onClick={decreaseFontSize}
            aria-label="Decrease font size"
          >
            <Minus size={14} />
          </button>
          <span className="font-size-display">{fontSize}px</span>
          <button
            className="font-control-button"
            onClick={increaseFontSize}
            aria-label="Increase font size"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
