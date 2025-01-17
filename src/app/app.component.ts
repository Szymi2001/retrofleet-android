import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { every, filter } from 'rxjs';
import { AppSettingsService } from 'src/services/appSettings.service';
import { AuthService } from 'src/services/auth.service';
import { ImageService } from 'src/services/endpoints/imageEndpoint.service';
import { UserInfo } from './shared/interfaces/user.interface';
import { ProfileService } from 'src/services/endpoints/profileEndpoint.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [],
})

export class AppComponent {
  private userId: string | null = null;

  isLoggedIn: boolean = false;
  titleNames: { title: string; path: string }[] = [];
  pageTitle = 'RetroFleet';
  showProfileButton: boolean = true;
  showSettingsButton: boolean = true;
  showBackButton: boolean = false;

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
    private appSettings: AppSettingsService,
    private imageService: ImageService,
    private translate: TranslateService,
    private profileService: ProfileService,
    private router: Router,
    private storageService: StorageService
  ) {
    this.initializeSettings();
    this.subscribeToAuthService();
    this.subscribeToRouterEvents();
    this.subscribeToLanguageChange();
  }

  private initializeSettings(): void {
    const settings = this.appSettings.loadSettings();
    this.translate.setDefaultLang(settings.language);
    this.translate.use(settings.language);
  }

  private subscribeToAuthService(): void {
    this.authService.isLoggedIn().subscribe(async (isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        await this.loadUserInfo();
      }
    });
  }

  private subscribeToRouterEvents(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updatePageTitle(event.urlAfterRedirects);
        this.updateButtonStates(event.urlAfterRedirects);
      });
  }

  private subscribeToLanguageChange(): void {
    this.translate.onLangChange.subscribe(() => this.updatePageTitle(this.router.url));
  }

  private async loadUserInfo(): Promise<void> {
    try {
      this.userId = await this.authService.getUserIdFromStorage();
      if (this.userId) {
        this.userInfo = await this.profileService.getUserInfo(this.userId);
      }
    } catch (error) {
      console.error(
        'Błąd podczas pobierania userId lub wykonania operacji:',
        error
      );
    }
  }

  private updatePageTitle(currentRoute: string): void {
    const defaultTitle = 'RetroFleet';

    if (!this.titleNames.length) {
      this.translate.get(this.getTabTitles()).subscribe((translations) => {
        this.titleNames = this.mapTitlesToPaths(translations);
        this.setPageTitleFromRoute(currentRoute, defaultTitle);
      });
    } else {
      this.setPageTitleFromRoute(currentRoute, defaultTitle);
    }
  }

  private setPageTitleFromRoute(currentRoute: string, defaultTitle: string): void {
    const menuItem = this.titleNames.find((item) => item.path === currentRoute);
    this.pageTitle = menuItem?.title || defaultTitle; 
  }

  private getTabTitles(): string[] {
    return [
      'TABS.LOGIN_TITLE',
      'TABS.CALENDAR_TITLE',
      'TABS.MYFLEET_TITLE',
      'TABS.LOGBOOK_TITLE',
      'TABS.SERVICES_TITLE',
      'TABS.SERVICE_SUMMARY_TITLE',
      'TABS.FUELING_TITLE',
      'TABS.FUELING_SUMMARY_TITLE',
      'TABS.SETTINGS_TITLE',
      'TABS.PROFILE_TITLE',
    ];
  }

  private mapTitlesToPaths(translations: any): { title: string; path: string }[] {
    return [
      { title: translations['TABS.MYFLEET_TITLE'], path: '/myfleet' },
      { title: translations['TABS.LOGBOOK_TITLE'], path: '/driving-log' },
      { title: translations['TABS.CALENDAR_TITLE'], path: '/calendar' },
      { title: translations['TABS.SERVICES_TITLE'], path: '/services/list' },
      { title: translations['TABS.SERVICES_TITLE'], path: '/services/summary' },
      { title: translations['TABS.FUELING_TITLE'], path: '/fuelings/list' },
      { title: translations['TABS.FUELING_TITLE'], path: '/fuelings/summary' },
      { title: translations['TABS.SETTINGS_TITLE'], path: '/settings' },
      { title: translations['TABS.PROFILE_TITLE'], path: '/profile' },
    ];
  }

  async navigateTo(path: string): Promise<void> {
    const currentPath = this.router.url;
    if (currentPath !== '/profile' && currentPath !== '/settings') {
      await this.storageService.set('previousPath', currentPath);
    }
    await this.router.navigate([path]);
  }

  async goBack(): Promise<void> {
    const previousPath = await this.storageService.get('previousPath');
    await this.router.navigate([previousPath || '/']);
  }

  private updateButtonStates(path: string): void {
    const isSpecialPage = path === '/profile' || path === '/settings';
    this.showProfileButton = !isSpecialPage;
    this.showSettingsButton =  !isSpecialPage;
    this.showBackButton = isSpecialPage && this.isLoggedIn;
  }
}
