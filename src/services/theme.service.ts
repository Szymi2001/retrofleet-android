import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private storageService: StorageService) {
  }

  saveSettings(isDark: boolean): void {
    this.storageService.set('theme', isDark ? 'dark' : 'light');
    this.applySettings(isDark);
  }

  async loadSettings(): Promise<void> {
    const savedTheme = await this.storageService.get('theme');

    const isDark = savedTheme === 'dark';

    this.applySettings(isDark);
  }

  private applySettings(isDark: boolean): void {
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }

  async getSettings() {
    const savedTheme = await this.storageService.get('theme');
    console.log("Saved theme: ", savedTheme)
    const isDark = savedTheme === 'dark';

    return { isDark };
  }
}
