import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VehicleMaintenanceService } from 'src/services/endpoints/vehicleMaintenanceEndpoint.service';
import { AddServiceModalComponent } from './add-service-modal/add-service-modal.component';

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

interface Service {
  _id?: string;
  user_id: string | null;
  car_id: string;
  brand: string;
  model: string;
  price: number;
  date: string;
  isoDate?: string;
  mileage: number;
  description?: string;
  type: string;
}

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.page.html',
  styleUrls: ['./add-service.page.scss'],
})
export class AddServicePage implements OnInit {

  private userId = localStorage.getItem('userId');

  //Sortowanie według typu serwisu
  filteredServices: any[] = [];
  vehicleStrings: any[] = [];

  myServices: Service[] = [];

  //Filtrowanie według typu
  selectedType: string = '';

  serviceOptions = [
    { name: 'Silnik', value: 'Silnik' },
    { name: 'Olej', value: 'Olej' },
    { name: 'Szyby', value: 'Szyby' },
    { name: 'Wulkanizacja', value: 'Wulkanizacja' },
    { name: 'Klimatyzacja', value: 'Klimatyzacja' },
    { name: 'Elektronika', value: 'Elektronika' },
    { name: 'Przegląd', value: 'Przegląd' },
    { name: 'Hamulce', value: 'Hamulce' },
    { name: 'Zawieszenie', value: 'Zawieszenie' },
    { name: 'Sprzęgło', value: 'Sprzęgło' },
    { name: 'Wydech', value: 'Wydech' },
    { name: 'Diagnostyka', value: 'Diagnostyka' },
    { name: 'Inne', value: 'Inne' },
  ];

  constructor(
    private modalController: ModalController,
    private vehicleMaintenanceService: VehicleMaintenanceService
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  async openAddServiceModal() {
    const modal = await this.modalController.create({
      component: AddServiceModalComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.addService(data.data);
        console.log(data.data)
      }
    });

    return await modal.present();
  }

  onSortChange(event: any) {
    const selectedType = event.detail.value;
    this.filteredServices = selectedType
    ? this.myServices.filter((service) => service.type === selectedType)
    : [...this.myServices];
  }

  clearFilters() {
    this.selectedType = '';
    this.filteredServices = this.myServices;
  }

  async addService(serviceData: any): Promise<void> {
    const newService = this.buildNewService(serviceData);

    try {
      //await this.vehicleMaintenanceService.addService(newService);
      this.myServices.push(newService);
      this.filteredServices = [...this.myServices];
      //await this.updateVehicleMileage(newService.car_id, serviceData);
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  buildNewService(serviceData: any): Service {
    const selectedCar = serviceData.selectedCar.value;
    const date = new Date(serviceData.date);

    return {
      user_id: this.userId,
      car_id: selectedCar._id,
      brand: selectedCar.brand,
      model: selectedCar.model,
      price: serviceData.price,
      date: this.formatDate(date),
      isoDate: date.toISOString(),
      mileage: serviceData.mileage,
      description: serviceData.description,
      type: serviceData.type
    };
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const monthName = MONTHS[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${monthName} ${year}`;
  }

  async updateVehicleMileage(vehicleId: string, vehicleData: any): Promise<void> {
    const selectedCar = vehicleData.selectedCar.value;
    const savedMileage = selectedCar.mileage;
    const mileage = vehicleData.mileage;

    if (mileage > savedMileage) {
      try {
        await this.vehicleMaintenanceService.updateMileage(vehicleId, mileage);
      } catch (error: any) {
        console.error('Błąd:', error.response?.data || error.message);
      }
    }
  }

  async loadServices(): Promise<void> {
    try {
      if (this.userId) {
        this.myServices = await this.vehicleMaintenanceService.getServices(
          this.userId
        );
        this.filteredServices = [...this.myServices];
      }
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  async deleteAction(service: Service): Promise<void> {
    try {
      await this.vehicleMaintenanceService.deleteService(service._id);
      this.myServices = this.myServices.filter((s) => s._id !== service._id);
      this.filteredServices = [...this.myServices];
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }
}
