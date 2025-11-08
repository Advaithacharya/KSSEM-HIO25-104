import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} shortcuts - Object mapping key combinations to callbacks
 * Example: { 'ctrl+k': () => console.log('Search'), 'esc': () => closeModal() }
 */
export function useKeyboardShortcut(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Build key combination string
      const keys = [];
      if (event.ctrlKey) keys.push('ctrl');
      if (event.altKey) keys.push('alt');
      if (event.shiftKey) keys.push('shift');
      if (event.metaKey) keys.push('meta');
      
      const key = event.key.toLowerCase();
      keys.push(key);
      
      const combination = keys.join('+');
      
      // Check if this combination exists in shortcuts
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination](event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export default useKeyboardShortcut;
