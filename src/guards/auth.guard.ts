import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      take(1),
      map(isLoggedIn => {
        const targetUrl = state.url;

        if (isLoggedIn && targetUrl === '/login') {
          this.router.navigate(['/myfleet']);
          return false;
        }

        if (!isLoggedIn && targetUrl !== '/login') {
          this.router.navigate(['/login']);
          return false;
        }

        return true;
      })
    );
  }
}
