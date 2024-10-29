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
import { TranslateService } from '@ngx-translate/core';
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

@Component({
  selector: 'app-car-info',
  templateUrl: './car-info.page.html',
  styleUrls: ['./car-info.page.scss'],
})
export class CarInfoPage implements OnInit {
  @ViewChild('slidingItem', { static: false }) slidingItem!: IonItemSliding;

  private userId!: string | null;

  //ImagePicker
  croppedImages: any[] = [];

  myFleet: Vehicle[] = [];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private fleetService: FleetService,
    private imageService: ImageService,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private storageService: StorageService
  ) {
    console.log(this.myFleet)
  }
//TODO: Dodanie nowego pojazdu, walidacja zdjęcia
//TODO: Zapisywanie pobranych pojazdów i zdjęć w serwisie aby uniknąć ponownego pobierania z bazy
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
    // await this.downloadPhotos(this.userId!);
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
    this.translate
      .get([
        'DELETECAR-ALERT.DELETE_CONFIRMATION_HEADER',
        'DELETECAR-ALERT.DELETE_CONFIRMATION_MESSAGE',
        'DELETECAR-ALERT.CANCEL',
        'DELETECAR-ALERT.DELETE',
      ])
      .subscribe(async (translations) => {
        const header =
          translations['DELETECAR-ALERT.DELETE_CONFIRMATION_HEADER'];
        const message =
          translations['DELETECAR-ALERT.DELETE_CONFIRMATION_MESSAGE'];
        const cancelText = translations['DELETECAR-ALERT.CANCEL'];
        const deleteText = translations['DELETECAR-ALERT.DELETE'];

        const alert = await this.alertController.create({
          header: header,
          message: message,
          buttons: [
            {
              text: cancelText,
              role: 'cancel',
              handler: async () => {
                await this.slidingItem.closeOpened();
              },
            },
            {
              text: deleteText,
              role: 'confirm',
              handler: async () => {
                await this.deleteCar(selectedCarData._id);
                this.alertController.dismiss();
              },
            },
          ],
        });

        await alert.present();
      });
  }

  //Pobieranie pojazdów z serwera
  async fetchFleetData() {
    if (!this.userId) {
      return;
    }

    try {
      this.myFleet = await this.fleetService.getVehicles(this.userId);

      if (this.myFleet.length > 0) {
        console.log("Pobrano zdjęcia z bazy!");
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
      this.croppedImages = await this.imageService.downloadCarPhotos(userId);
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
        this.croppedImages = this.croppedImages.filter(
          (image) => image.carId !== carId
        );

        // Usunięcie zdjęć z bazy danych
        await this.imageService.deletePhoto(this.userId!, carId);

        //Zamknięcie ion-item-sliding
        await this.slidingItem.closeOpened();
      }
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }
}
