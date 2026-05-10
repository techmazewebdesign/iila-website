import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`relative w-9 h-9 flex items-center justify-center rounded-sm
        border transition-all duration-300 group
        border-t-border/20 hover:border-gold/50
        bg-t-surface/60 hover:bg-t-surface
        ${className}`}
    >
      {isDark ? (
        <Sun
          size={14}
          className="text-gold/80 group-hover:text-gold transition-colors duration-200"
          strokeWidth={1.8}
        />
      ) : (
        <Moon
          size={14}
          className="text-t-muted group-hover:text-gold transition-colors duration-200"
          strokeWidth={1.8}
        />
      )}
    </button>
  )
}
