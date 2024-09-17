import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInKey = 'isLoggedIn';
  private userIdKey = 'userId';
  private loggedInSubject: BehaviorSubject<boolean>;
  private userIdSubject: BehaviorSubject<string | null>;

  constructor() {
    const initialLoggedIn = this.getInitialLoggedInStatus();
    this.loggedInSubject = new BehaviorSubject<boolean>(initialLoggedIn);
    const initialUserId = this.getUserIdFromLocalStorage();
    this.userIdSubject = new BehaviorSubject<string | null>(initialUserId);
  }

  setLoggedIn(value: boolean, userId: string | null) {
    try {
      localStorage.setItem(this.isLoggedInKey, value ? 'true' : 'false');
      if (value && userId) {
        localStorage.setItem(this.userIdKey, userId);
        this.userIdSubject.next(userId);
      } else {
        localStorage.removeItem(this.userIdKey);
        this.userIdSubject.next(null);
      }
      this.loggedInSubject.next(value);
    } catch (error) {
      console.error('Błąd podczas ustawiania statusu logowania:', error);
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  getUserId(): Observable<string | null> {
    return this.userIdSubject.asObservable();
  }

  private getInitialLoggedInStatus(): boolean {
    try {
      const loggedIn = localStorage.getItem(this.isLoggedInKey);
      return loggedIn === 'true';
    } catch (error) {
      console.error('Błąd podczas pobierania statusu zalogowania:', error);
      return false;
    }
  }

  private getUserIdFromLocalStorage(): string | null {
    try {
      return localStorage.getItem(this.userIdKey);
    } catch (error) {
      console.error('Błąd podczas pobierania userId:', error);
      return null;
    }
  }

  logout(): void {
    try {
      localStorage.removeItem(this.isLoggedInKey);
      localStorage.removeItem(this.userIdKey);
      this.userIdSubject.next(null);
      this.setLoggedIn(false, null);
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  }
}
