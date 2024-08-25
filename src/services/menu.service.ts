import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItemsSubject = new BehaviorSubject<Array<{ title: string; icon: string; path: string }>>([]);
  menuItems$ = this.menuItemsSubject.asObservable();

  constructor(private authService: AuthService) {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.updateMenuItems(loggedIn);
    });
  }

  private updateMenuItems(isLoggedIn: boolean) {
    const items = isLoggedIn ? [
      { title: 'Moja flota', icon: 'car-outline', path: '/tabs/myfleet' },
      { title: 'Kalendarz', icon: 'calendar-outline', path: '/tabs/calendar' },
      { title: 'Dziennik jazd', icon: 'document-text-outline', path: '/tabs/driving-log' },
      { title: 'Serwisy', icon: 'construct-outline', path: '/tabs/add-service' },
      { title: 'Tankowania', icon: 'speedometer-outline', path: '/tabs/add-fueling' },
      { title: 'Podsumowanie serwisów', icon: 'clipboard-outline', path: '/tabs/service-summary' },
      { title: 'Podsumowanie tankowań', icon: 'stats-chart-outline', path: '/tabs/fueling-summary' },
      { title: 'Wyloguj się', icon: 'log-out-outline', path: '/tabs/home' }
    ] : [
      { title: 'Zaloguj się', icon: 'log-in-outline', path: '/tabs/login' },
      { title: 'Załóż konto', icon: 'person-add-outline', path: '/tabs/register' }
    ];
    this.menuItemsSubject.next(items);
  }
}
