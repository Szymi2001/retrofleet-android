import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LoadingController, MenuController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { AppSettingsService } from 'src/services/appSettings.service';
import { AuthService } from 'src/services/auth.service';
import { ImageService } from 'src/services/endpoints/imageEndpoint.service';

interface MenuItem {
  title: string;
  icon: string;
  path: string;
  action?: () => void;
}

interface MenuDivider {
  isDivider: true;
}

type MenuItemOrDivider = MenuItem | MenuDivider;

type MenuItems = MenuItemOrDivider[];

interface Translations {
  [key: string]: string;
}

export const backend_Url = 'http://localhost:3000';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [],
})
export class AppComponent {
  private userId = localStorage.getItem('userId');

  mainMenuItems: MenuItemOrDivider[] = [];
  profileMenuItems: MenuItemOrDivider[] = [];

  isLoggedIn: boolean = true;
  pageTitle: string = 'RetroFleet';

  profileImage: any[] = [];

  constructor(
    private menuController: MenuController,
    private authService: AuthService,
    private appSettings: AppSettingsService,
    private imageService: ImageService,
    private translate: TranslateService,
    private router: Router
  ) {
    const settings = this.appSettings.loadSettings();
    this.translate.setDefaultLang(settings.language);
    this.translate.use(settings.language);
  }

  //TODO: Anomalia po zalogowaniu następnego użytkownika
  async ngOnInit() {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.updateMainMenuItems();
      this.updateProfileMenuItems();
    });

    await this.downloadPhotos(this.userId!);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });

    this.translate.onLangChange.subscribe(() => {
      this.updateMainMenuItems();
      this.updateProfileMenuItems();
      this.updatePageTitle();
    });

    this.updateMainMenuItems();
    this.updateProfileMenuItems();
  }

  updatePageTitle() {
    const activeRoute = this.router.url.split('/').pop();

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

    const menuItem = this.mainMenuItems.find((item): item is MenuItem => {
      return (item as MenuItem).path === `/${activeRoute}`;
    });

    if (menuItem) {
      this.pageTitle = menuItem.title || 'RetroFleet';
    } else {
      this.pageTitle = 'RetroFleet';
    }
  }

  isDivider(item: MenuItemOrDivider): item is MenuDivider {
    return (item as MenuDivider).isDivider === true;
  }

  openMainMenu() {
    this.menuController.open('main-menu');
  }

  openProfileMenu() {
    this.menuController.open('profile-menu');
  }

  goToProfile() {
    this.router.navigate(['/profile']);
    this.menuController.close('profile-menu');
  }

  goToPage(path: string, action?: () => void, closeMenuId?: string) {
    this.router.navigateByUrl(path);
    if (closeMenuId) {
      this.menuController.close(closeMenuId);
    }

    if (action) {
      action();
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

  updateMainMenuItems() {
    if (!this.isLoggedIn) {
      this.translate
        .get(['LOGIN.TITLE', 'REGISTER.TITLE'])
        .subscribe((translations: Translations) => {
          this.mainMenuItems = [
            {
              title: translations['LOGIN.TITLE'],
              icon: 'log-in-outline',
              path: '/login',
            },
            {
              title: translations['REGISTER.TITLE'],
              icon: 'person-add-outline',
              path: '/register',
            },
            { isDivider: true },
            {
              title: 'Wyświetlanie',
              icon: 'settings-outline',
              path: '/settings',
            },
          ];
        });
    } else {
      this.translate
        .get([
          'MENU.MANAGEMENT_TITLE',
          'MENU.MYFLEET_TITLE',
          'MENU.CALENDAR_TITLE',
          'MENU.LOGBOOK_TITLE',
          'MENU.SERVICES_TITLE',
          'MENU.FUELING_TITLE',
          'MENU.SERVICE_SUMMARY_TITLE',
          'MENU.FUELING_SUMMARY_TITLE',
          'MENU.LOGOUT_TITLE',
          'MENU.REPORTS_TITLE',
          'MENU.SETTINGS_TITLE',
        ])
        .subscribe((translations) => {
          this.mainMenuItems = [
            {
              title: translations['MENU.MYFLEET_TITLE'],
              icon: 'car-outline',
              path: '/myfleet',
            },
            {
              title: translations['MENU.CALENDAR_TITLE'],
              icon: 'calendar-outline',
              path: '/calendar',
            },
            {
              title: translations['MENU.LOGBOOK_TITLE'],
              icon: 'document-text-outline',
              path: '/driving-log',
            },
            {
              title: translations['MENU.SERVICES_TITLE'],
              icon: 'construct-outline',
              path: '/add-service',
            },
            {
              title: translations['MENU.FUELING_TITLE'],
              icon: 'speedometer-outline',
              path: '/add-fueling',
            },
            { isDivider: true },
            {
              title: translations['MENU.SERVICE_SUMMARY_TITLE'],
              icon: 'clipboard-outline',
              path: '/service-summary',
            },
            {
              title: translations['MENU.FUELING_SUMMARY_TITLE'],
              icon: 'stats-chart-outline',
              path: '/fueling-summary',
            },
          ];
        });
    }
  }

  updateProfileMenuItems() {
    if (this.isLoggedIn) {
      this.translate
        .get([
          'MENU.MANAGEMENT_TITLE',
          'MENU.MYFLEET_TITLE',
          'MENU.CALENDAR_TITLE',
          'MENU.LOGBOOK_TITLE',
          'MENU.SERVICES_TITLE',
          'MENU.FUELING_TITLE',
          'MENU.SERVICE_SUMMARY_TITLE',
          'MENU.FUELING_SUMMARY_TITLE',
          'MENU.LOGOUT_TITLE',
          'MENU.REPORTS_TITLE',
          'MENU.SETTINGS_TITLE',
        ])
        .subscribe((translations) => {
          this.profileMenuItems = [
            {
              title: 'Wyświetlanie',
              icon: 'settings-outline',
              path: '/settings',
            },
            {
              title: translations['MENU.LOGOUT_TITLE'],
              icon: 'log-out-outline',
              path: '/login',
              action: () => this.logout(),
            },
          ];
        });
    }
  }

  dismiss() {
    this.menuController.close();
  }

  logout() {
    this.menuController.toggle('profile-menu');
    this.authService.logout();
  }
}
