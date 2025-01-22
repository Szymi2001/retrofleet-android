import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonItemSliding,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { FleetService } from 'src/services/endpoints/fleetEndpoint.service';
import { ImageService } from 'src/services/endpoints/imageEndpoint.service';
import { AddVehicleModalComponent } from './add-vehicle-modal/add-vehicle-modal.component';
import { EditInfoModalComponent } from './edit-info/edit-info-modal.component';
import { ImagePickerComponent } from './image-picker-modal/image-picker-modal.component';
import { AuthService } from 'src/services/auth.service';
import { StorageService } from 'src/services/storage.service';

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
//TODO: W celach zabytkowych (przegląd co rok), inaczej dożywotnio.
@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.page.html',
  styleUrls: ['./car-info.page.scss'],
})
export class CarInfoPage implements OnInit {
  @ViewChild('slidingItem', { static: false }) slidingItem!: IonItemSliding;

  private userId!: string | null;

  //ImagePicker
  croppedImages: { [key: string]: string } = {};

  myFleet: Vehicle[] = [];

  statusIcon: string = '';

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private fleetService: FleetService,
    private imageService: ImageService,
    private datePipe: DatePipe,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    this.authService.isLoggedIn().subscribe(async (isLoggedIn) => {
      if (isLoggedIn) {
        this.userId = await this.storageService.get('userId');
        await this.fetchFleetData();
      } else {
        this.clearFleetData();
      }
    });

    await this.presentLoading();
    this.loadingController.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Ładowanie modułu...',
    });
    await loading.present();
    return loading;
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

  async openImagePicker(selectedCarData: any) {
    const modal = await this.modalController.create({
      component: ImagePickerComponent,
      componentProps: {
        carId: selectedCarData._id,
      },
    });

    modal.onDidDismiss().then((data) => {
      if (
        data.data &&
        (data.data.imageAdded == true || data.data.imageDeleted === true) &&
        this.userId
      ) {
        this.downloadPhotos(this.userId);
      }
    });

    await this.slidingItem.closeOpened();
    return await modal.present();
  }

  async openEditInfo(selectedCarData: any) {
    const modal = await this.modalController.create({
      component: EditInfoModalComponent,
      componentProps: {
        carData: selectedCarData,
      },
    });
    await this.slidingItem.closeOpened();
    return await modal.present();
  }

  async presentDeleteConfirmation(selectedCarData: any) {
    const alert = await this.alertController.create({
      header: 'Moja flota',
      message: 'Czy na pewno chcesz usunąć pojazd?',
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          handler: async () => {
            await this.slidingItem.closeOpened();
          },
        },
        {
          text: 'Potwierdź',
          role: 'confirm',
          handler: async () => {
            await this.deleteCar(selectedCarData._id);
            this.alertController.dismiss();
          },
        },
      ],
    });

    await alert.present();
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

  clearFleetData() {
    this.myFleet = [];
  }

  async addVehicle(vehicleData: any): Promise<void> {
    const newVehicle = this.buildNewVehicle(vehicleData);

    try {
      await this.fleetService.addVehicle(newVehicle);
      this.myFleet.push(newVehicle);
      this.fetchFleetData();
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  buildNewVehicle(vehicleData: any): Vehicle {
    const technicalInspectionFormattedDate = this.formatDate(
      vehicleData.technicalInspectionDate
    );
    const insuranceExpiryFormattedDate = this.formatDate(
      vehicleData.insuranceExpiryDate
    );

    return {
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
  }

  //Formatowanie daty np.10/07/2024
  formatDate(date: any): string | null {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  //Funkcja asynchroniczna pobierająca wszystkie zdjęcia pojazdów użytkownika
  async downloadPhotos(userId: string) {
    try {
      const images = await this.imageService.downloadImages(userId);
      this.croppedImages = images.reduce(
        (acc: { [key: string]: string }, image: any) => {
          if (image.carId) {
            acc[image.carId] = image.url;
          }
          return acc;
        },
        {}
      );
    } catch (error) {
      console.error('Błąd podczas pobierania zdjęcia:', error);
    }
  }

  async deleteCar(carId: string) {
    try {
      const carIndex = this.myFleet.findIndex((car) => car._id === carId);
      if (carIndex !== -1) {
        // Usuwanie pojazdu z tablicy myFleet
        this.myFleet.splice(carIndex, 1);

        // Usunięcie pojazdu z bazy danych
        await this.fleetService.deleteVehicle(carId);

        // (Opcjonalnie) Znajdź i usuń zdjęcie powiązane z tym pojazdem
        if (this.croppedImages[carId]) {
          delete this.croppedImages[carId];
        }

        // Usunięcie zdjęć z bazy danych
        await this.imageService.deleteImage(this.userId!, carId);

        //Zamknięcie ion-item-sliding
        await this.slidingItem.closeOpened();
      }
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  getCarStatus(vehicleData: any): number {
    const isHeritageListed = vehicleData.is_heritage_listed;
    const technicalInspectionDate = vehicleData.technical_inspection_date;
    const registrationNumber = vehicleData.registration_number;
    const insuranceExpiryDate = vehicleData.insurance_expiry_date;

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

  getStatusLabel(vehicleData: any): string {
    const percentage = this.getCarStatus(vehicleData);

    if (percentage > 75) {
      return 'Gotowy do jazdy';
    } else if (percentage <= 75) {
      return 'Wymaga uwagi';
    } else {
      return 'Stan nieokreślony';
    }
  }

  getStatusIcon(vehicleData: any): { icon: string, color: string } {
    const percentage = this.getCarStatus(vehicleData);

    if (percentage > 75) {
      return { icon: 'checkmark-circle', color: 'success' };
    } else if (percentage <= 75) {
      return { icon: 'alert-circle', color: 'danger' };
    } else {
      return { icon: 'alert-circle', color: 'danger' };
    }
  }

  getReadyForUseCount(): number {
    return this.myFleet.filter(car => this.getCarStatus(car) === 100).length;
  }
}
