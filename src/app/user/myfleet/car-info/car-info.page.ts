import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FleetService } from 'src/services/endpoints/fleetEndpoint.service';
import { ImageService } from 'src/services/endpoints/imageEndpoint.service';
import { ImageUpdateService } from 'src/services/imageUpdate.service';
import { CarService } from 'src/services/carService.service';
import { AddVehicleModalComponent } from './add-vehicle-modal/add-vehicle-modal.component';
import { CarPopoverComponent } from './car-popover/car-popover.component';

export interface Vehicle {
  _id?: string;
  user_id: string | null;
  vin: string;
  mileage: number;
  brand: string;
  model: string;
  year: number;
  body_type: string;
  fuel_type: string;
  color: string;
  is_heritage_listed: boolean;
  technical_inspection_date: string | null;
  registration_number: string;
  insurance_expiry_date: string | null;
}

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.page.html',
  styleUrls: ['./car-info.page.scss'],
})
export class CarInfoPage implements OnInit {
  @ViewChild('popover') popover: any;

  private subscription!: Subscription;
  private userId = localStorage.getItem('userId');

  //ImagePicker
  croppedImages: any[] = [];

  myFleet: Vehicle[] = [];
  selectedCar: any = [];

  constructor(
    private modalController: ModalController,
    private popoverController: PopoverController,
    private fleetService: FleetService,
    private imageService: ImageService,
    private imageUpdateService: ImageUpdateService,
    private carService: CarService,
    private datePipe: DatePipe
  ) {}

  async ngOnInit() {
    this.fetchFleetData();

    this.imageUpdateService.photoUpdate$.subscribe(() => {
      this.downloadPhotos(this.userId!);
    });

    this.carService.carToRemove$.subscribe((carId) => {
      if (carId) {
        this.handleRemove(carId);
        this.carService.clearCarToRemove();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async openAddVehicleModal() {
    const modal = await this.modalController.create({
      component: AddVehicleModalComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.addVehicle(data.data);
      }
    });

    return await modal.present();
  }

  async presentPopover(event: Event, carObject: any) {
    const popover = await this.popoverController.create({
      component: CarPopoverComponent,
      event: event,
      translucent: true,
      componentProps: { carObject: carObject },
    });

    return await popover.present();
  }

  //Pobieranie pojazdów z serwera
  async fetchFleetData() {
    if (!this.userId) {
      return;
    }

    try {
      this.myFleet = await this.fleetService.getVehicles(this.userId);
      if (this.myFleet.length > 0) {
        this.downloadPhotos(this.userId);
      }
    } catch (error) {
      console.error('Błąd podczas pobierania pojazdów:', error);
    }
  }

  async addVehicle(vehicleData: any) {
    const technicalInspectionFormattedDate = this.formatDate(
      vehicleData.technicalInspectionDate
    );
    const insuranceExpiryFormattedDate = this.formatDate(
      vehicleData.insuranceExpiryDate
    );

    const newCar = {
      user_id: this.userId,
      vin: vehicleData.vin,
      mileage: vehicleData.mileage,
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year,
      body_type: vehicleData.bodyType,
      fuel_type: vehicleData.fuelType,
      color: vehicleData.color,
      is_heritage_listed: vehicleData.isHeritageListed,
      technical_inspection_date: technicalInspectionFormattedDate,
      registration_number: vehicleData.registrationNumber,
      insurance_expiry_date: insuranceExpiryFormattedDate,
    };
    try {
      await this.fleetService.addVehicle(newCar);
      this.myFleet.push(newCar);
      this.fetchFleetData();
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  //Formatowanie daty np.10/07/2024
  formatDate(date: any): string | null {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  //Dane do progressbar
  getCarStatus(index: number): number {
    const isHeritageListed = this.myFleet[index].is_heritage_listed;
    const technicalInspectionDate =
      this.myFleet[index].technical_inspection_date;
    const registrationNumber = this.myFleet[index].registration_number;
    const insuranceExpiryDate = this.myFleet[index].insurance_expiry_date;

    function calculatePercentage(
      isHeritageListed: boolean,
      technicalInspectionDate: any,
      insuranceExpiryDate: any,
      registrationNumber: string
    ): number {
      let percentage = 0;

      if (isHeritageListed) {
        percentage += 25;
      }

      if (technicalInspectionDate !== null) {
        percentage += 25;
      }

      if (insuranceExpiryDate !== null) {
        percentage += 25;
      }

      if (registrationNumber !== null && registrationNumber !== '') {
        percentage += 25;
      }

      return percentage;
    }

    const calculatedPercentage = calculatePercentage(
      isHeritageListed,
      technicalInspectionDate,
      insuranceExpiryDate,
      registrationNumber
    );

    return calculatedPercentage;
  }

  //Funkcja asynchroniczna pobierająca wszystkie zdjęcia pojazdów użytkownika
  async downloadPhotos(userId: string) {
    try {
      this.croppedImages = await this.imageService.downloadPhotos(userId);
    } catch (error) {
      console.error('Błąd podczas pobierania zdjęcia:', error);
    }
  }

  handleRemove(carId: string) {
    // Znajdź indeks pojazdu w tablicy myFleet
    const carIndex = this.myFleet.findIndex((car) => car._id === carId);
    if (carIndex !== -1) {
      // Usuwanie pojazdu z tablicy myFleet
      this.myFleet.splice(carIndex, 1);

      // (Opcjonalnie) Znajdź i usuń zdjęcie powiązane z tym pojazdem
      this.croppedImages = this.croppedImages.filter(
        (image) => image.carId !== carId
      );
    }
  }
}
