import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInKey = 'isLoggedIn';
  private userIdKey = 'userId';
  private loggedInSubject: BehaviorSubject<boolean>;
  private userIdSubject: BehaviorSubject<string | null>;

  constructor(private storageService: StorageService, private router: Router) {
    this.loggedInSubject = new BehaviorSubject<boolean>(false);
    this.userIdSubject = new BehaviorSubject<string | null>(null);
    this.initializeAuthState();
  }

  private async initializeAuthState() {
    await this.storageService.init();
    const initialLoggedIn = await this.getInitialLoggedInStatus();
    this.loggedInSubject.next(initialLoggedIn);
    const initialUserId = await this.getUserIdFromStorage();
    this.userIdSubject.next(initialUserId);
  }

  async setLoggedIn(value: boolean, userId: string | null) {
    try {
      await this.storageService.set(this.isLoggedInKey, value ? 'true' : 'false');
      if (value && userId) {
        await this.storageService.set(this.userIdKey, userId);
        this.userIdSubject.next(userId);
      } else {
        await this.storageService.remove(this.userIdKey);
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

  private async getInitialLoggedInStatus(): Promise<boolean> {
    try {
      const loggedIn = await this.storageService.get(this.isLoggedInKey);
      return loggedIn === 'true';
    } catch (error) {
      console.error('Błąd podczas pobierania statusu zalogowania:', error);
      return false;
    }
  }

  async getUserIdFromStorage(): Promise<string | null> {
    try {
      return await this.storageService.get(this.userIdKey);
    } catch (error) {
      console.error('Błąd podczas pobierania userId:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.storageService.remove(this.isLoggedInKey);
      await this.storageService.remove(this.userIdKey);
      this.userIdSubject.next(null);
      await this.setLoggedIn(false, null);

      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  }
}
