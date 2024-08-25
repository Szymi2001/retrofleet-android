import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/services/auth.service';
import { ThemeService } from 'src/services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  isLoggedIn: boolean = true;

  paletteToggle = false;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    const settings = this.themeService.getSettings();
    this.paletteToggle = settings.isDark;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.initializeDarkPalette(prefersDark.matches);

    prefersDark.addEventListener('change', (mediaQuery) =>
      this.initializeDarkPalette(mediaQuery.matches)
    );
  }

  initializeDarkPalette(isDark: any) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  toggleDarkModeChange(event: any) {
    const isDark = event.detail.checked;
    this.themeService.saveSettings(isDark);
  }

  toggleDarkPalette(shouldAdd: any) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }
}
