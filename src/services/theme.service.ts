import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeKey = 'theme';

  constructor() {}

  saveSettings(isDark: boolean): void {
    localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
    this.applySettings(isDark);
  }

  loadSettings(): void {
    const savedTheme = localStorage.getItem(this.themeKey);

    const isDark = savedTheme === 'dark';

    this.applySettings(isDark);
  }

  private applySettings(isDark: boolean): void {
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }

  getSettings(): { isDark: boolean } {
    const savedTheme = localStorage.getItem(this.themeKey);

    const isDark = savedTheme === 'dark';

    return { isDark };
  }
}
