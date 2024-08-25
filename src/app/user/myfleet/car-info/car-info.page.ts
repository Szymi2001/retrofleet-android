import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FleetService } from 'src/services/fleetService.service';
import { ImageService } from 'src/services/imageService.service';
import { NewCarPage } from './new-car/new-car.page';
import { MoreOptionsComponent } from './more-options/more-options.component';
import { ImageUpdateService } from 'src/services/imageUpdate.service';
import { CarService } from 'src/services/carService.service';

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

  private subscription!: Subscription;
  private userId = localStorage.getItem('userId');

  submitted: boolean = false;

  myFleet: Vehicle[] = [];
  selectedCar: any = [];

  croppedImages: any[] = [];

  @ViewChild('moreOptionsPopover', { static: true }) moreOptionsPopover: any;

  constructor(
    private fleetService: FleetService,
    private imageService: ImageService,
    private imageUpdateService: ImageUpdateService,
    private carService: CarService,
    private modalController: ModalController,
    private popoverController: PopoverController,
    private datePipe: DatePipe
  ) {}

  async ngOnInit() {
    this.fetchFleetData();

    this.imageUpdateService.photoUpdate$.subscribe(() => {
      this.downloadPhotos(this.userId!);
    });

    this.carService.carToRemove$.subscribe(carId => {
      if (carId) {
        this.handleRemove(carId);
        this.carService.clearCarToRemove();
      }
    })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

  //Otwieranie okna dialogowego dodawania pojazdu
  async openDialog() {
    const modal = await this.modalController.create({
      component: NewCarPage,
    });
    return await modal.present();
  }

  //Wyświetlanie opcji w Więcej
  async presentPopover(event: Event, carObject: any) {
    const popover = await this.popoverController.create({
      component: MoreOptionsComponent,
      event: event,
      backdropDismiss: true,
      componentProps: {
        carProperties: carObject,
        dismissPopover: async () => {
          await popover.dismiss();
        }
      },
      translucent: true
    });

    return await popover.present();
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
    const carIndex = this.myFleet.findIndex(car => car._id === carId);
    if (carIndex !== -1) {
      // Usuwanie pojazdu z tablicy myFleet
      this.myFleet.splice(carIndex, 1);

      // (Opcjonalnie) Znajdź i usuń zdjęcie powiązane z tym pojazdem
      this.croppedImages = this.croppedImages.filter(image => image.carId !== carId);
    }
  }
}
