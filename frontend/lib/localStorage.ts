// Local storage utilities for persisting data
export class LocalStorage {
  static get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === 'undefined') return defaultValue || null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : (defaultValue || null);
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue || null;
    }
  }

  static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
    }
  }

  static remove(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage for key "${key}":`, error);
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Specific methods for common data types
  static getUser() {
    return this.get('user');
  }

  static setUser(user: any) {
    return this.set('user', user);
  }

  static getAcceptedJobs() {
    return this.get('acceptedJobs', []);
  }

  static setAcceptedJobs(jobs: any[]) {
    return this.set('acceptedJobs', jobs);
  }

  static getSettings() {
    return this.get('settings', {});
  }

  static setSettings(settings: any) {
    return this.set('settings', settings);
  }

  static getTheme() {
    return this.get('theme', 'light');
  }

  static setTheme(theme: string) {
    return this.set('theme', theme);
  }
}