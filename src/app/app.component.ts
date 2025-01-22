import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController, PopoverController } from '@ionic/angular';
import { every, filter } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { ImageService } from 'src/services/endpoints/imageEndpoint.service';
import { UserInfo } from './shared/interfaces/user.interface';
import { ProfileService } from 'src/services/endpoints/profileEndpoint.service';
import { StorageService } from 'src/services/storage.service';
import { ThemeService } from 'src/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [],
})
export class AppComponent {
  private userId: string | null = null;

  isLoggedIn: boolean = false;
  pageTitle = 'RetroFleet';
  showProfileButton: boolean = true;
  showSettingsButton: boolean = true;
  showBackButton: boolean = false;
  theme: boolean = false;

  userInfo: UserInfo = {
    login: '',
    password: '',
    email: '',
    name: '',
    surname: '',
    first_question: '',
    first_answer: '',
    second_question: '',
    second_answer: '',
  };

  constructor(
    private authService: AuthService,
    private imageService: ImageService,
    private profileService: ProfileService,
    private router: Router,
    private storageService: StorageService,
    private themeService: ThemeService
  ) {
    this.loadTheme();
    this.subscribeToAuthService();
    this.subscribeToRouterEvents();
  }

  private async loadTheme(): Promise<void> {
    await this.themeService.loadSettings();
    const settings = await this.themeService.getSettings();
    this.theme = settings.isDark;
  }

  toggleDarkMode(): void {
    this.theme = !this.theme;
    this.themeService.saveSettings(this.theme);
  }

  private subscribeToAuthService(): void {
    this.authService.isLoggedIn().subscribe(async (isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) await this.loadUserInfo();
    });
  }

  private subscribeToRouterEvents(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.updateButtonStates(event.urlAfterRedirects);
        this.updatePageTitle(event.urlAfterRedirects);
      });
  }

  private async loadUserInfo(): Promise<void> {
    try {
      this.userId = await this.authService.getUserIdFromStorage();
      if (this.userId)
        this.userInfo = await this.profileService.getUserInfo(this.userId);
    } catch (error) {
      console.error('Błąd podczas pobierania danych użytkownika:', error);
    }
  }

  async navigateTo(path: string): Promise<void> {
    const currentPath = this.router.url;
    if (!['/profile', '/settings'].includes(currentPath)) {
      await this.storageService.set('previousPath', currentPath);
    }
    await this.router.navigate([path]);
  }

  async goBack(): Promise<void> {
    const previousPath = (await this.storageService.get('previousPath')) || '/';
    await this.router.navigate([previousPath]);
  }

  private updateButtonStates(path: string): void {
    const isSpecialPage = ['/profile', '/settings'].includes(path);
    this.showProfileButton = !isSpecialPage;
    this.showSettingsButton = !isSpecialPage;
    this.showBackButton = isSpecialPage && this.isLoggedIn;
  }

  private updatePageTitle(path: string) {
    const titles: { [key: string]: string } = {
      '/profile': 'Profil',
      '/myfleet': 'Moja flota',
      '/driving-log': 'Dziennik tras',
      '/calendar': 'Kalendarz',
      '/services/list': 'Lista serwisów',
      '/services/summary': 'Podsumowanie',
      '/fuelings/list': 'Lista tankowań',
      '/fuelings/summary': 'Podsumowanie'
    }
    this.pageTitle = titles[path] || 'RetroFleet';
  }
}
