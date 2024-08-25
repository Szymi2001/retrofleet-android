import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { ThemeService } from 'src/services/theme.service';

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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
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
    private router: Router
  ) {
    this.themeService.loadSettings();
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.updateMenuItems();
    });

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
        this.pageTitle = 'Mój profil';
        break;
      case 'settings':
        this.pageTitle = 'Ustawienia';
        break;
      case 'home':
        this.pageTitle = 'RetroFleet';
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
      this.menuItems = [
        {
          title: 'Zaloguj się',
          icon: 'log-in-outline',
          path: '/login',
        },
        {
          title: 'Załóż konto',
          icon: 'person-add-outline',
          path: '/register',
        },
      ];
    } else {
      this.menuItems = [
        {
          groupTitle: 'Zarządzanie flotą',
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
              path: '/home',
              action: () => this.logout()
            }
          ]
        }
      ];
    }
  }
  

  dismiss() {
    this.menuController.close();
  }

  logout() {
    this.authService.logout();
  }
}
