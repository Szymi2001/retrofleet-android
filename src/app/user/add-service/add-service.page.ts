import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VehicleMaintenanceService } from 'src/services/endpoints/vehicleMaintenanceEndpoint.service';
import { NewServiceComponent } from './new-service/new-service.component';

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
  insertedPrice: number;
  date: string;
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

  async openDialog() {
    const modal = await this.modalController.create({
      component: NewServiceComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.serviceAdded) {
        this.loadServices();
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
