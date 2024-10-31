import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
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
//TODO: Popover musi znikać po kliknięciu
export class AppComponent {
  private userId!: string | null;

  isLoggedIn: boolean = false;
  profileMenuItems: any[] = [];
  titleNames: any[] = [];
  pageTitle = 'RetroFleet';

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
    private menuController: MenuController,
    private authService: AuthService,
    private appSettings: AppSettingsService,
    private imageService: ImageService,
    private translate: TranslateService,
    private profileService: ProfileService,
    private router: Router,
    private storageService: StorageService
  ) {
    this.initializeSettings();
  }

  async ngOnInit() {
    //Init Ionic Storage
    await this.storageService.init();

    this.subscribeToAuthService();
    this.subscribeToRouterEvents();
    this.subscribeToLanguageChange();
  }

  private initializeSettings() {
    const settings = this.appSettings.loadSettings();
    this.translate.setDefaultLang(settings.language);
    this.translate.use(settings.language);
  }

  private subscribeToAuthService() {
    this.authService.isLoggedIn().subscribe(async (isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        await this.handleUserData();
      }
    });
  }

  private subscribeToRouterEvents() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });
  }

  private subscribeToLanguageChange() {
    this.translate.onLangChange.subscribe(() => {
      this.setProfileMenuItems();
      this.updatePageTitle();
    });
  }

  private async handleUserData() {
    try {
      this.userId = await this.storageService.get('userId');
      await Promise.all([
        this.loadUserInfo(),
        this.setProfileMenuItems()
      ]);
    } catch (error) {
      console.error('Błąd podczas pobierania userId lub wykonania operacji:', error);
    }
  }

  private updatePageTitle() {
    const activeRoute = this.router.url;

    this.pageTitle = activeRoute === 'profile'
    ? this.getProfileTitle()
    : this.getMenuItemTitle(activeRoute) || 'RetroFleet';
  }

  private getProfileTitle() {
    let translatedTitle = '';
    this.translate.get('PROFILE.TITLE').subscribe((title: string) => {
      translatedTitle = title;
    });
    return translatedTitle;
  }

  private getMenuItemTitle(activeRoute: string) {
    this.translate.get(this.getTabTitles()).subscribe((translations) => {
      this.titleNames = this.mapTitlesToPaths(translations);
    });

    const menuItem = this.titleNames.find(item => item.path === activeRoute);
    return menuItem ? menuItem.title : null;
  }

  private getTabTitles() {
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

  private mapTitlesToPaths(translations: any) {
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

  async profileMenu() {
    const isOpen = await this.menuController.isOpen('profile-menu');
    await this.menuController[isOpen? 'close' : 'open']('profile-menu');
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.menuController.close('profile-menu');
  }

  async loadUserInfo(): Promise<void> {
    if (!this.userId) return;

    try {
      this.userInfo = await this.profileService.getUserInfo(this.userId);
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  setProfileMenuItems() {
    if (this.isLoggedIn) {
      this.translate.get(['TABS.LOGOUT_TITLE', 'TABS.SETTINGS_TITLE'])
        .subscribe(translations => {
          this.profileMenuItems = this.createProfileMenuItems(translations);
        });
    }
  }


  private createProfileMenuItems(translations: any) {
    return [
      { title: translations['TABS.SETTINGS_TITLE'], icon: 'settings-outline', path: '/settings' },
      { title: translations['TABS.LOGOUT_TITLE'], icon: 'log-out-outline', path: '/login', action: () => this.logout() },
    ];
  }

  logout() {
    this.menuController.close('main-menu');
    this.router.navigate(['/login']);
    this.authService.logout();
  }
}
