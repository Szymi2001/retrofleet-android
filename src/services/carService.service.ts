import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private carToRemoveSubject = new BehaviorSubject<string | null>(null);
  carToRemove$ = this.carToRemoveSubject.asObservable();

  setCarToRemove(carId: string) {
    this.carToRemoveSubject.next(carId);
  }

  clearCarToRemove() {
    this.carToRemoveSubject.next(null);
  }
}
