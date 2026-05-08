import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className={`theme-toggle-icon ${isDark ? 'rotated' : ''}`}>
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </div>
    </button>
  );
}
