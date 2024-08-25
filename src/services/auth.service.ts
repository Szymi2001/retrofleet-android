import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private localStorageKey = 'isLoggedIn';
  private loggedInSubject: BehaviorSubject<boolean>;

  constructor() {
    const initialLoggedIn = this.getInitialLoggedInStatus();
    this.loggedInSubject = new BehaviorSubject<boolean>(initialLoggedIn);
  }

  setLoggedIn(value: boolean) {
    try {
      localStorage.setItem(this.localStorageKey, value ? 'true' : 'false');
      this.loggedInSubject.next(value);
    } catch (error) {
      console.error('Błąd podczas ustawiania statusu logowania:', error);
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  private getInitialLoggedInStatus(): boolean {
    try {
      const loggedIn = localStorage.getItem(this.localStorageKey);
      return loggedIn === 'true';
    } catch (error) {
      console.error('Błąd podczas pobierania statusu zalogowania:', error);
      return false;
    }
  }

  logout(): void {
    try {
      localStorage.removeItem(this.localStorageKey);
      this.setLoggedIn(false);
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  }
}
