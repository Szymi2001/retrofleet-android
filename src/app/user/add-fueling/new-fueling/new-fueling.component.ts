import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { fleetDataService } from 'src/services/fleetData.service';
import { FleetService } from 'src/services/endpoints/fleetEndpoint.service';

interface FuelReceipt {
  _id?: string;
  user_id: string | null;
  car_id: string;
  brand: string;
  model: string;
  insertedPrice: number;
  day: number;
  month: number;
  year: number;
  date: string;
  mileage: number;
  description?: string;
  fuelType: string;
  fuelAmount: string;
  transactionType: string;
  receiptNumber?: number;
}

@Component({
  selector: 'app-new-fueling',
  templateUrl: './new-fueling.component.html',
  styleUrls: ['./new-fueling.component.scss'],
})
export class NewFuelingComponent  implements OnInit {
  private userId = localStorage.getItem('userId');

  submitted = false;
  fuelReceiptForm!: FormGroup;

  fuelTypes: string[] = [];

  vehicleStrings: any[] = [];
  receivedData: any[] = [];

  //Maksymalna data w kalendarzu
  maxDate = new Date().toISOString();

  myReceipts: FuelReceipt[] = [];

  transactionTypes = [
    { label: 'Karta', value: 'Card' },
    { label: 'Gotówka', value: 'Cash' }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private fleetService: FleetService,
    private fleetDataService: fleetDataService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadVehicleData();
    this.populateDropdowns();
  }

  initializeForm(): void {
    this.fuelReceiptForm = this.formBuilder.group({
      price: [null, Validators.required],
      selectedCar: ['', Validators.required],
      date: [this.maxDate, Validators.required],
      mileage: [null, Validators.required],
      description: [''],
      fuelType: [null, Validators.required],
      fuelAmount: [null, Validators.required],
      transactionType: ['', Validators.required],
      receiptNumber: [null]
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
    console.log(this.vehicleStrings)
  }

  updateVehicleStrings(): void {
    this.vehicleStrings = this.receivedData.slice(0, 5).map((vehicle) => ({
      label: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      value: vehicle,
    }));
  }

  populateDropdowns(): void {
    this.fuelTypes = this.fleetDataService
      .getFuelTypes()
      .map((type) => type.fuel_type);
  }

  async onSubmit(): Promise<void> {
    console.info(this.fuelReceiptForm.value)
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
