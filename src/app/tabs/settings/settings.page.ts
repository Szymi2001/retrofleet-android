import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppSettingsService } from 'src/services/appSettings.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {
  isLoggedIn: boolean = true;

  paletteToggle = false;
  selectedLanguage: string = 'pl';

  constructor(
    private modalController: ModalController,
    private appSettings: AppSettingsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    const settings = this.appSettings.loadSettings();
    this.selectedLanguage = settings.language;

    this.initializeDarkPalette(settings.isDark);
  }

  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  toggleDarkModeChange(event: any) {
    const isDark = event.detail.checked;
    this.appSettings.saveSettings(isDark, this.selectedLanguage);
  }

  toggleDarkPalette(shouldAdd: any) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  onLanguageChange(event: any) {
    this.selectedLanguage = event.detail.value;
    this.appSettings.saveSettings(this.paletteToggle, this.selectedLanguage);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
