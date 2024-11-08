import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RouteService } from 'src/services/routeService.service';
import { AddDrivingLogModal } from './add-driving-log-modal/add-driving-log-modal.component';
import { AuthService } from 'src/services/auth.service';

const MONTHS = [
  'styczeń',
  'luty',
  'marzec',
  'kwiecień',
  'maj',
  'czerwiec',
  'lipiec',
  'sierpień',
  'wrzesień',
  'październik',
  'listopad',
  'grudzień',
];

interface Route {
  user_id: string | null;
  car_id: string;
  brand: string;
  model: string;
  start_location: string;
  end_location: string;
  distance: string;
  duration: string;
  status: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-driving-log',
  templateUrl: './driving-log.page.html',
  styleUrls: ['./driving-log.page.scss'],
})

//TODO: Usuwanie tras dla usuniętego pojazdu
export class DrivingLogPage implements OnInit {
  userId: string | null = null;
  myRoutes: Route[] = [];

  constructor(
    private routeService: RouteService,
    private modalController: ModalController,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  async openAddDrivingLogModal() {
    const modal = await this.modalController.create({
      component: AddDrivingLogModal,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.addRoute(data.data);
      }
    });

    return await modal.present();
  }

  async loadRoutes(): Promise<void> {
    try {
      this.userId = await this.authService.getUserIdFromStorage();
      if (this.userId) {
        this.myRoutes = await this.routeService.getRoutes(this.userId);
      }
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  async addRoute(routeData: any): Promise<void> {
    const newRoute = this.buildNewRoute(routeData);

    try {
      await this.routeService.addRoute(newRoute);
      this.myRoutes.push(newRoute);
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  buildNewRoute(routeData: any): Route {
    const selectedCar = routeData.selectedCar.value;

    const date = new Date(routeData.date);
    const status = routeData.status;

    return {
      user_id: this.userId,
      car_id: selectedCar._id,
      brand: selectedCar.brand,
      model: selectedCar.model,
      start_location: routeData.startLocation,
      end_location: routeData.endLocation,
      distance: routeData.distance,
      duration: routeData.duration,
      status: status.label,
      date: this.formatDate(date),
      description: routeData.description,
    };
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const monthName = MONTHS[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${monthName} ${year}`;
  }
}
