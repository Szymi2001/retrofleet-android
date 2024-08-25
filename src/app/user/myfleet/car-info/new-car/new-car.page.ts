import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { fleetDataService } from 'src/services/fleetData.service';

@Component({
  selector: 'app-new-car',
  templateUrl: './new-car.page.html',
  styleUrls: ['./new-car.page.scss'],
})
export class NewCarPage implements OnInit {
  submitted = false;
  vehicleForm!: FormGroup;

  carBrands: string[] = [];
  carModels: string[] = [];
  carColors: string[] = [];
  carProductionYear: number[] = [];
  carBodyTypes: string[] = [];
  carFuelTypes: string[] = [];

  maxDate: string = '';

  setMaxDate() {
    // Get current date and format it to 'YYYY-MM-DD'
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.maxDate = `${year}-${month}-${day}`;
  }

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private fleetData: fleetDataService
  ) {
    this.setMaxDate();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.populateDropdowns();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  initializeForm() {
    this.vehicleForm = this.formBuilder.group({
      enteredVin: ['', Validators.required],
      enteredMileage: ['', Validators.required],
      selectedBrand: [null, Validators.required],
      selectedModel: [{ value: null, disabled: true }, Validators.required],
      selectedBodyType: ['', Validators.required],
      selectedFuelType: ['', Validators.required],
      selectedYear: ['', Validators.required],
      selectedColor: ['', Validators.required],
      isHeritageListed: [false],
      technicalInspectionDate: [null],
      registrationNumber: [''],
      insuranceExpiryDate: [null],
    });

    this.vehicleForm.get('selectedBrand')?.valueChanges.subscribe((value) => {
      if (value) {
        this.vehicleForm.get('selectedModel')?.enable();
      } else {
        this.vehicleForm.get('selectedModel')?.disable();
      }
    });
  }

  populateDropdowns(): void {
    this.carBrands = this.fleetData
      .getBrandName()
      .map((bran) => bran.brand);
    this.carBrands.sort((a, b) => a.localeCompare(b));
    this.carBodyTypes = this.fleetData
      .getBodyTypes()
      .map((type) => type.body_type);
    this.carFuelTypes = this.fleetData
      .getFuelTypes()
      .map((type) => type.fuel_type);
    this.carColors = this.fleetData.getColors().map((color) => color.color);

    const currentYear = new Date().getFullYear();
    const oldestYear = currentYear - 30 - 50;
    for (let i = currentYear - 30; i >= oldestYear; i--) {
      this.carProductionYear.push(i);
    }
  }

  //Filtrowanie modeli wg marki
  filterModels() {
    if (!this.vehicleForm.get('selectedBrand')) {
      this.carModels = [];
      this.vehicleForm.get('selectedModel')?.setValue(null);
      return;
    }
    this.carModels = this.fleetData.getModelForBrand(
      this.vehicleForm.get('selectedBrand')?.value
    );
    this.vehicleForm.get('selectedModel')?.setValue(null);
    console.log('Marki', this.carBrands)
    console.log('Modele', this.carModels)
  }

  //Funkcja asynchroniczna dodawania pojazdu
  async addVehicle() {
    // this.submitted = true;
    // if (this.vehicleForm.valid) {
    //   const technicalInspectionDate = this.carData.get(
    //     'technicalInspectionDate'
    //   )?.value;
    //   const insuranceExpiryDate = this.carData.get(
    //     'insuranceExpiryDate'
    //   )?.value;
    //   const technicalInspectionFormattedDate = this.formatDate(
    //     technicalInspectionDate
    //   );
    //   const insuranceExpiryFormattedDate = this.formatDate(insuranceExpiryDate);
    //   const newCar = {
    //     user_id: this.userId,
    //     vin: this.carData.get('enteredVin')?.value,
    //     mileage: this.carData.get('enteredMileage')?.value,
    //     brand: this.carData.get('selectedBrand')?.value,
    //     model: this.carData.get('selectedModel')?.value,
    //     year: this.carData.get('selectedYear')?.value,
    //     body_type: this.carData.get('selectedBodyType')?.value,
    //     fuel_type: this.carData.get('selectedFuelType')?.value,
    //     color: this.carData.get('selectedColor')?.value,
    //     is_heritage_listed: this.carData.get('isHeritageListed')?.value,
    //     technical_inspection_date: technicalInspectionFormattedDate,
    //     registration_number: this.carData.get('registrationNumber')?.value,
    //     insurance_expiry_date: insuranceExpiryFormattedDate,
    //   };
    //   try {
    //     await this.fleetService.addVehicle(newCar);
    //     this.myFleet.push(newCar);
    //     //this.fetchFleetData();
    //   } catch (error: any) {
    //     console.error('Błąd:', error.response?.data || error.message);
    //   }
    // }
  }
}
