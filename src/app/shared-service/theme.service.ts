import {LocalStorageUtil} from '../@core/utils/local-storage-utils';


export class ThemeService {
  themes = {
    light: 'light-theme',
    dark: 'dark-theme'
  };

  /**
   * @description
   * Saves the selected theme into localStorage with encryption.
   * @param theme The theme to save (light, dark).
   */
  saveTheme(theme: keyof typeof this.themes): void {
    try {
      const currentTheme = this.themes[theme];
      localStorage.setItem('terminal-theme', currentTheme); // Store theme as a string in localStorage
      // Optionally, you can use your LocalStorageUtil to manage encrypted data
      LocalStorageUtil.setStorage({ theme: currentTheme }); // Store encrypted data (optional)
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }

  /**
   * @description
   * Retrieves the theme from localStorage.
   * @returns The saved theme, or default 'light-theme' if no theme is found.
   */
  getTheme(): keyof typeof this.themes {
    try {
      const savedTheme = localStorage.getItem('terminal-theme') as keyof typeof this.themes;
      // You can also retrieve the encrypted data via LocalStorageUtil and use it if needed
      const storedData = LocalStorageUtil.getStorage();
      const theme = storedData?.data?.theme || savedTheme || 'light'; // Check both encrypted and unencrypted
      return theme as keyof typeof this.themes;
    } catch (error) {
      console.error('Failed to retrieve theme:', error);
      return 'light'; // Default theme if nothing is found or an error occurs
    }
  }

  private isDarkMode = false;

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }
  }
}
