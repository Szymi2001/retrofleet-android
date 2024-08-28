import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  private themeKey = 'theme';
  private languageKey = 'language';

  constructor(private translate: TranslateService) {
  }

  saveSettings(isDark: boolean, language: string): void {
    localStorage.setItem(this.themeKey, isDark ? 'dark' : 'light');
    localStorage.setItem(this.languageKey, language);
    this.applySettings(isDark);
    this.translate.use(language);
  }

  loadSettings(): { isDark: boolean, language: string } {
    const savedTheme = localStorage.getItem(this.themeKey);
    const savedLanguage = localStorage.getItem(this.languageKey) || 'pl';

    const isDark = savedTheme === 'dark';

    this.applySettings(isDark);
    this.translate.use(savedLanguage);

    return { isDark, language: savedLanguage }
  }

  private applySettings(isDark: boolean): void {
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }
}
