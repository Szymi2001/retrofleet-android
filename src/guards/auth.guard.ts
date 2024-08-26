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
        const redirectUrl = isLoggedIn ? '/tabs/myfleet' : '/';
        if (isLoggedIn && state.url === '/tabs/login') {
          this.router.navigate([redirectUrl]);
          return false;
        } else if (!isLoggedIn && state.url !== '/') {
          this.router.navigate(['/']);
          return false;
        } else if (isLoggedIn && state.url === '/') {
          this.router.navigate([redirectUrl]);
          return false;
        }
        return true;
      })
    );
  }
}
