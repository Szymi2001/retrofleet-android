import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { AppSettingsService } from 'src/services/appSettings.service';
import { AuthService } from 'src/services/auth.service';
import { SettingsComponent } from './tabs/settings/settings.component';

interface MenuItem {
  title: string;
  icon: string;
  path: string;
  action?: () => void;
}

interface MenuGroup {
  groupTitle: string;
  items: MenuItem[];
}

type MenuItems = MenuItem | MenuGroup;

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
  menuItems: MenuItems[] = [];
  isLoggedIn: boolean = true;
  pageTitle: string = 'RetroFleet';

  constructor(
    private menuController: MenuController,
    private modalController: ModalController,
    private authService: AuthService,
    private appSettings: AppSettingsService,
    private translate: TranslateService,
    private router: Router
  ) {
    const settings = this.appSettings.loadSettings();
    this.translate.setDefaultLang(settings.language);
    this.translate.use(settings.language);
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.updateMenuItems();
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });

    this.translate.onLangChange.subscribe(() => {
      this.updateMenuItems();
      this.updatePageTitle();
    });

    this.updateMenuItems();
  }

  async openSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsComponent
    });

    return await modal.present();
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

    const menuItem = this.menuItems.find((item) =>
      this.isMenuGroup(item)
        ? item.items.some((subItem) => subItem.path === `/${activeRoute}`)
        : item.path === `/${activeRoute}`
    );

    if (menuItem) {
      if (this.isMenuGroup(menuItem)) {
        const subItem = menuItem.items.find(
          (subItem) => subItem.path === `/${activeRoute}`
        );
        this.pageTitle = subItem?.title || 'RetroFleet';
      } else {
        this.pageTitle = menuItem.title || 'RetroFleet';
      }
    } else {
      this.pageTitle = 'RetroFleet';
    }
  }

  goToPage(path: string, action?: () => void) {
    this.router.navigateByUrl(path);
    this.menuController.toggle();

    if (action) {
      action();
    }
  }

  isMenuGroup(item: MenuItems | undefined): item is MenuGroup {
    return (item as MenuGroup).items !== undefined;
  }

  updateMenuItems() {
    if (!this.isLoggedIn) {
      this.translate
        .get(['LOGIN.TITLE', 'REGISTER.TITLE'])
        .subscribe((translations: Translations) => {
          this.menuItems = [
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
          'MENU.SETTINGS_TITLE'
        ])
        .subscribe((translations) => {
          this.menuItems = [
            {
              groupTitle: translations['MENU.MANAGEMENT_TITLE'],
              items: [
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
              ],
            },
            {
              groupTitle: translations['MENU.REPORTS_TITLE'],
              items: [
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
              ],
            },
            {
              groupTitle: translations['MENU.SETTINGS_TITLE'],
              items: [
                {
                  title: translations['MENU.LOGOUT_TITLE'],
                  icon: 'log-out-outline',
                  path: '/login',
                  action: () => this.logout(),
                },
              ],
            },
          ];
        });
    }
  }

  dismiss() {
    this.menuController.close();
  }

  logout() {
    this.authService.logout();
  }
}
