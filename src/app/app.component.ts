import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
<<<<<<< HEAD
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { ThemeService } from 'src/services/theme.service';
=======
import { MenuController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { AppSettingsService } from 'src/services/appSettings.service';
import { AuthService } from 'src/services/auth.service';
import { SettingsComponent } from './tabs/settings/settings.component';
>>>>>>> 2108c01 (module settings, more translations)

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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
<<<<<<< HEAD
  providers: [ MessageService ]
})
export class AppComponent  {
  menuItems: MenuItems[] = [];
  isLoggedIn: boolean = true;
  pageTitle: string = 'RetroFleet'

  constructor(
    private menuController: MenuController,
    private authService: AuthService,
    private themeService: ThemeService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.themeService.loadSettings();
    //TODO: Obsługa zmiany języka
    translate.use('en')
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => {
=======
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
>>>>>>> 2108c01 (module settings, more translations)
      this.isLoggedIn = loggedIn;
      this.updateMenuItems();
    });

<<<<<<< HEAD
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
    });
    this.updateMenuItems();
  }

  updatePageTitle() {
    const activeRoute = this.router.url.split('/').pop();
  
    switch (activeRoute) {
      case 'profile':
        this.translate.get('PROFILE.TITLE').subscribe((translatedTitle: string) => {
          this.pageTitle = translatedTitle;
        });
        break;
      case 'settings':
        this.translate.get('SETTINGS.TITLE').subscribe((translatedTitle: string) => {
          this.pageTitle = translatedTitle;
        });
        break;
      default:
        const menuItem = this.menuItems.find(item =>
          this.isMenuGroup(item) ? item.items.some(subItem => subItem.path === `/${activeRoute}`) : item.path === `/${activeRoute}`
        );
  
        if (this.isMenuGroup(menuItem)) {
          const subItem = menuItem.items.find(subItem => subItem.path === `/${activeRoute}`);
          this.pageTitle = subItem?.title || 'RetroFleet';
        } else {
          this.pageTitle = menuItem?.title || 'RetroFleet';
        }
        break;
=======
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
>>>>>>> 2108c01 (module settings, more translations)
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
<<<<<<< HEAD
      this.translate.get(['MENU.MANAGEMENT_TITLE', 'LOGIN.TITLE', 'REGISTER.TITLE']).subscribe((translations: Translations) => {
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
      this.menuItems = [
        {
          groupTitle: 'Zarządzanie',
          items: [
            {
              title: 'Moja flota',
              icon: 'car-outline',
              path: '/myfleet',
            },
            {
              title: 'Kalendarz',
              icon: 'calendar-outline',
              path: '/calendar',
            },
            {
              title: 'Dziennik jazd',
              icon: 'document-text-outline',
              path: '/driving-log',
            },
            {
              title: 'Serwisy',
              icon: 'construct-outline',
              path: '/add-service',
            },
            {
              title: 'Tankowania',
              icon: 'speedometer-outline',
              path: '/add-fueling',
            },
          ]
        },
        {
          groupTitle: 'Raporty',
          items: [
            {
              title: 'Podsumowanie serwisów',
              icon: 'clipboard-outline',
              path: '/service-summary',
            },
            {
              title: 'Podsumowanie tankowań',
              icon: 'stats-chart-outline',
              path: '/fueling-summary',
            },
          ]
        },
        {
          groupTitle: 'Ustawienia',
          items: [
            {
              title: 'Wyloguj się',
              icon: 'log-out-outline',
              path: '/login',
              action: () => this.logout()
            }
          ]
        }
      ];
    }
  }
  
=======
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
>>>>>>> 2108c01 (module settings, more translations)

  dismiss() {
    this.menuController.close();
  }

  logout() {
    this.authService.logout();
  }
}
