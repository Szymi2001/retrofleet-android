import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FleetService } from 'src/services/endpoints/fleetEndpoint.service';
import { RouteService } from 'src/services/routeService.service';
import { NewDrivingLogComponent } from './new-driving-log/new-driving-log.component';

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
export class DrivingLogPage implements OnInit {
  private userId = localStorage.getItem('userId');

  myRoutes: Route[] = [];

  constructor(
    private routeService: RouteService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  async openDialog() {
    const modal = await this.modalController.create({
      component: NewDrivingLogComponent,
    });

    return await modal.present();
  }

  async loadRoutes(): Promise<void> {
    try {
      if (this.userId) {
        this.myRoutes = await this.routeService.getRoutes(
          this.userId
        );
      }
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }
}
