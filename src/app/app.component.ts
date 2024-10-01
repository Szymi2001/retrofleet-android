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

  isLoggedIn: boolean = true;
  mainMenuItems: any[] = [];
  profileMenuItems: any[] = [];
  selectedPath = '';
  previousPath!: string | undefined;
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
    this.authService.isLoggedIn().subscribe(async (isLoggedIn) => {
      if (isLoggedIn) {
        this.userId = localStorage.getItem('userId');
        //Załaduj zdjęcie profilowe
        this.downloadPhotos(this.userId!);
        this.loadUserInfo();
      }
      this.updateMainMenuItems();
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.selectedPath = event.url;
      });

    this.translate.onLangChange.subscribe(() => {
      this.updateMainMenuItems();
      this.updatePageTitle();
    });
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

  mainMenu(action: string) {
    if (action === 'open' || action === 'close') {
      this.menuController[action]('main-menu');
    }
  }

  navigateToPage(path: string) {
    this.router.navigate([path], { replaceUrl: true });
    this.previousPath = this.selectedPath;
  }

  goBack() {
    if (this.previousPath) {
      this.router.navigate([this.previousPath]);
    }
    this.previousPath = '';
  }

  goToProfile() {
    this.router.navigate(['/profile']);
    this.menuController.close('main-menu');
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

  updateMainMenuItems() {
    if (!this.isLoggedIn) {
      this.translate
        .get(['LOGIN.TITLE', 'REGISTER.TITLE', 'MENU.DISPLAY_TITLE'])
        .subscribe((translations) => {
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
            {
              title: translations['MENU.DISPLAY_TITLE'],
              icon: 'settings-outline',
              path: '/settings',
            },
          ];
          console.log(translations)
        });
    } else {
      this.translate
        .get([
          'MENU.LOGOUT_TITLE',
          'MENU.DISPLAY_TITLE',
        ])
        .subscribe((translations) => {
          this.mainMenuItems = [
            {
              title: translations['MENU.DISPLAY_TITLE'],
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
          console.log(translations)
        });
    }
  }

  logout() {
    this.menuController.close('profile-menu');
    this.authService.logout();
  }
}
