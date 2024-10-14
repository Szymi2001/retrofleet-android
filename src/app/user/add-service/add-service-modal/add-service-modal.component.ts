import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FleetService } from 'src/services/endpoints/fleetEndpoint.service';
import { maxLengthValidator } from '../../../shared/validators/formValidators';

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
  templateUrl: './add-service-modal.component.html',
  styleUrls: ['./add-service-modal.component.scss'],
})
export class AddServiceModalComponent implements OnInit {
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
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadVehicleData();
  }

  initializeForm(): void {
    this.serviceForm = this.formBuilder.group({
      price: [null, Validators.required],
      selectedCar: ['', Validators.required],
      date: [this.maxDate, Validators.required],
      mileage: ['', [maxLengthValidator(7), Validators.required]],
      description: [''],
      type: [null, Validators.required],
      repairItems: this.formBuilder.array([]),
    });
  }

  // formatMileage(value: string): string {
  //   return value.replace(/[^0-9]/g, '');
  // }

  // onMileageChange(event: any) {
  //   const inputValue = this.formatMileage(event.target.value);
  //   event.target.value = inputValue;
  //   this.serviceForm.get('mileage')?.setValue(inputValue, { emitEvent: false });
  // }

  get repairItems() {
    return this.serviceForm.get('repairItems') as FormArray;
  }

  addRepairItem(): void {
    const repairItemGroup = this.formBuilder.group({
      itemDescription: ['', Validators.required],
      itemCost: [null, Validators.required],
    });

    this.repairItems.push(repairItemGroup);
  }

  removeRepairItem(index: number): void {
    this.repairItems.removeAt(index);
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

  updateVehicleStrings(): void {
    this.vehicleStrings = this.receivedData.slice().map((vehicle) => ({
      label: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      value: vehicle,
    }));
  }

  submitForm() {
    console.log('test')
    if (this.serviceForm.valid) {
      this.modalController.dismiss(this.serviceForm.value);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
