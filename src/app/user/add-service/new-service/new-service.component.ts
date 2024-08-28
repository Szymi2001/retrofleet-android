import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FleetService } from 'src/services/fleetService.service';
import { VehicleMaintenanceService } from 'src/services/vehicleMaintenanceService.service';

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
  isoDate: string;
  mileage: number;
  description?: string;
  type: string;
}

@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.scss'],
})
export class NewServiceComponent  implements OnInit {
  @Output() serviceAdded = new EventEmitter<void>();
  private userId = localStorage.getItem('userId');

  submitted = false;
  serviceForm!: FormGroup;

  vehicleStrings: any[] = [];
  receivedData: any[] = [];
  //Sortowanie według typu serwisu
  filteredServices: any[] = [];

  //Maksymalna data w kalendarzu
  maxDate = new Date().toISOString();

  myServices: Service[] = [];


  //TODO: Zmienić na wyświetlanie <interface>
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
    private fleetService: FleetService,
    private vehicleMaintenanceService: VehicleMaintenanceService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadVehicleData();
    this.loadServices();
  }

  initializeForm(): void {
    this.serviceForm = this.formBuilder.group({
      price: [null, Validators.required],
      selectedCar: ['', Validators.required],
      date: [this.maxDate, Validators.required],
      mileage: [null, Validators.required],
      description: [''],
      type: [null, Validators.required],
    });
  }

  async loadVehicleData(): Promise<void> {
    try {
      if (this.userId) {
        this.receivedData = await this.fleetService.getVehicles(this.userId);
        this.updateVehicleStrings();
      }
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
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

  updateVehicleStrings(): void {
    this.vehicleStrings = this.receivedData.slice().map((vehicle) => ({
      label: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      value: vehicle,
    }));
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const monthName = MONTHS[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${monthName} ${year}`;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.serviceForm.invalid) {
      return;
    }

    const newService = this.buildNewService();
    try {
      await this.vehicleMaintenanceService.addService(newService);
      this.myServices.push(newService);
      this.filteredServices = [...this.myServices];
      await this.updateVehicleMileage(newService.car_id);
      this.dismiss(true);
      this.serviceAdded.emit();
    } catch (error: any) {
      this.dismiss(false);
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  buildNewService(): Service {
    const selectedCar = this.serviceForm.get('selectedCar')?.value;
    const date = new Date(this.serviceForm.get('date')?.value);

    return {
      user_id: this.userId,
      car_id: selectedCar.value._id,
      brand: selectedCar.value.brand,
      model: selectedCar.value.model,
      insertedPrice: this.serviceForm.get('price')?.value,
      date: this.formatDate(date),
      isoDate: date.toISOString(),
      mileage: this.serviceForm.get('mileage')?.value,
      description: this.serviceForm.get('description')?.value,
      type: this.serviceForm.get('type')?.value,
    };
  }

  async updateVehicleMileage(vehicleId: string): Promise<void> {
    const selectedCar = this.serviceForm.get('selectedCar')?.value;
    const savedMileage = selectedCar.mileage;
    const mileage = this.serviceForm.get('mileage')?.value;

    if (mileage > savedMileage) {
      try {
        await this.vehicleMaintenanceService.updateMileage(vehicleId, mileage);
      } catch (error: any) {
        console.error('Błąd:', error.response?.data || error.message);
      }
    }
  }

  async deleteAction(service: Service): Promise<void> {
    try {
      await this.vehicleMaintenanceService.deleteService(service._id);
      this.myServices = this.myServices.filter(s => s._id !== service._id);
      this.filteredServices = [...this.myServices];
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  dismiss(serviceAdded: boolean = false) {
    this.modalController.dismiss({
      serviceAdded: serviceAdded
    });
  }
<<<<<<< HEAD

=======
>>>>>>> 2108c01 (module settings, more translations)
}
