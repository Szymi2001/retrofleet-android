import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { AppSettingsService } from 'src/services/appSettings.service';
import { AuthService } from 'src/services/auth.service';
import { ImageService } from 'src/services/endpoints/imageEndpoint.service';
import { UserInfo } from './shared/interfaces/user.interface';
import { ProfileService } from 'src/services/endpoints/profileEndpoint.service';

interface MenuItem {
  title: string;
  icon: string;
  path: string;
  action?: () => void;
}

interface Translations {
  [key: string]: string;
}

export const backend_Url = 'http://localhost:3000';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [],
})
export class AppComponent {
  private userId!: string | null;

  isLoggedIn: boolean = false;
  profileMenuItems: any[] = [];
  titleNames: any[] = [];
  pageTitle: string = 'RetroFleet';

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
  profileImage: any[] = [];

  constructor(
    private menuController: MenuController,
    private authService: AuthService,
    private appSettings: AppSettingsService,
    private imageService: ImageService,
    private translate: TranslateService,
    private profileService: ProfileService,
    private router: Router
  ) {
    const settings = this.appSettings.loadSettings();
    this.translate.setDefaultLang(settings.language);
    this.translate.use(settings.language);
  }

  async ngOnInit() {
    this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        this.userId = localStorage.getItem('userId');
        //Załaduj zdjęcie profilowe
        this.downloadPhotos(this.userId!);
        this.loadUserInfo();
      }
    });

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.updatePageTitle();
      });

    this.translate.onLangChange.subscribe(() => {
      this.setProfileMenuItems();
      this.updatePageTitle();
    });
    this.setProfileMenuItems();
  }

  updatePageTitle() {
    const activeRoute = this.router.url;

    if (!activeRoute) {
      this.pageTitle = 'RetroFleet';
      return;
    }

    if (activeRoute === 'profile') {
      this.translate
        .get('PROFILE.TITLE')
        .subscribe((translatedTitle: string) => {
          this.pageTitle = translatedTitle;
        });
      return;
    }

    this.translate
      .get([
        'TABS.LOGIN_TITLE',
        'TABS.CALENDAR_TITLE',
        'TABS.MYFLEET_TITLE',
        'TABS.LOGBOOK_TITLE',
        'TABS.SERVICES_TITLE',
        'TABS.SERVICE_SUMMARY_TITLE',
        'TABS.FUELING_TITLE',
        'TABS.FUELING_SUMMARY_TITLE',
        'TABS.SETTINGS_TITLE',
      ])
      .subscribe((translations) => {
        this.titleNames = [
          {
            title: translations['TABS.MYFLEET_TITLE'],
            path: '/myfleet',
          },
          {
            title: translations['TABS.CALENDAR_TITLE'],
            path: '/calendar',
          },
          {
            title: translations['TABS.SERVICES_TITLE'],
            path: '/services/list',
          },
          {
            title: translations['TABS.SERVICES_TITLE'],
            path: '/services/summary',
          },
          {
            title: translations['TABS.FUELING_TITLE'],
            path: '/add-fueling',
          },
          {
            title: translations['TABS.SETTINGS_TITLE'],
            path: '/settings',
          },
        ];
      });

    const menuItem = this.titleNames.find((item) => {
      return item.path === `${activeRoute}`;
    });

    if (menuItem) {
      this.pageTitle = menuItem.title || 'RetroFleet';
    } else {
      this.pageTitle = 'RetroFleet';
    }
  }

  async profileMenu(action: string) {
    const isOpen = await this.menuController.isOpen('profile-menu');
    if (isOpen) {
      this.menuController.close('profile-menu');
    } else {
      this.menuController.open('profile-menu');
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.profileMenu('close');
  }

  private async loadUserInfo(): Promise<void> {
    if (!this.userId) return;

    try {
      this.userInfo = await this.profileService.getUserInfo(this.userId);
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  //Funkcja asynchroniczna pobierająca wszystkie zdjęcia pojazdów użytkownika
  async downloadPhotos(userId: string) {
    try {
      this.profileImage = await this.imageService.downloadProfileImage(userId);
    } catch (error) {
      console.error('Błąd podczas pobierania zdjęcia:', error);
    }
  }

  setProfileMenuItems() {
    if (this.isLoggedIn) {
      this.translate
        .get(['TABS.LOGOUT_TITLE', 'TABS.SETTINGS_TITLE'])
        .subscribe((translations) => {
          this.profileMenuItems = [
            {
              title: translations['TABS.SETTINGS_TITLE'],
              icon: 'settings-outline',
              path: '/settings',
            },
            {
              title: translations['TABS.LOGOUT_TITLE'],
              icon: 'log-out-outline',
              path: '/login',
              action: () => this.logout(),
            },
          ];
        });
    }
  }

  logout() {
    this.menuController.close('main-menu');
    this.router.navigate(['/login']);
    this.authService.logout();
  }
}
