import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddFuelingModalComponent } from './add-fueling-modal/add-fueling-modal.component';
import { FuelingService } from 'src/services/endpoints/fuelingEndpoint.service';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface FuelReceipt {
  _id?: string;
  user_id: string | null;
  car_id: string;
  brand: string;
  model: string;
  price: number;
  date: string;
  mileage: number;
  description: string;
  fuelType: string;
  fuelAmount: string;
  transactionType: string;
  receiptNumber: number;
}

@Component({
  selector: 'app-add-fueling',
  templateUrl: './add-fueling.page.html',
  styleUrls: ['./add-fueling.page.scss'],
})
export class AddFuelingPage implements OnInit {

  private userId = localStorage.getItem('userId');
  myFuelings: FuelReceipt[] = [];

  constructor(private modalController: ModalController, private fuelingService: FuelingService) { }

  ngOnInit() {
    this.loadFuelings();
  }

  async openAddFuelingModal() {
    const modal = await this.modalController.create({
      component: AddFuelingModalComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.addFueling(data.data);
      }
    });
    return await modal.present();
  }

  async addFueling(fuelingData: any): Promise<void> {
    const newFueling = this.buildNewFueling(fuelingData);

    try {
      await this.fuelingService.addFueling(newFueling);
      this.myFuelings.push(newFueling);
      //await this.updateVehicleMileage(newService.car_id, serviceData);
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  buildNewFueling(serviceData: any): FuelReceipt {
    const selectedCar = serviceData.selectedCar.value;
    const date = new Date(serviceData.date);

    return {
      user_id: this.userId,
      car_id: selectedCar._id,
      brand: selectedCar.brand,
      model: selectedCar.model,
      price: serviceData.price,
      date: format(date, 'd MMMM yyyy', { locale: pl }),
      mileage: serviceData.mileage,
      description: serviceData.description,
      fuelType: serviceData.fuelType,
      fuelAmount: serviceData.fuelAmount,
      transactionType: serviceData.transactionType,
      receiptNumber: serviceData.receiptNumber
    };
  }

  async loadFuelings(): Promise<void> {
    try {
      if (this.userId) {
        this.myFuelings = await this.fuelingService.getFuelings(
          this.userId
        );
        //this.filteredServices = [...this.myServices];
      }
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }
}
