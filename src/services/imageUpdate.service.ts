import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUpdateService {
  private photoUpdateSubject = new Subject<void>();

  photoUpdate$ = this.photoUpdateSubject.asObservable();

  notifyPhotoUpdate() {
    this.photoUpdateSubject.next();
  }
}
