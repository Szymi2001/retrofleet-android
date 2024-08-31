import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { fleetDataService } from 'src/services/fleetData.service';

@Component({
  selector: 'app-add-vehicle-modal',
  templateUrl: './add-vehicle-modal.component.html',
  styleUrls: ['./add-vehicle-modal.component.scss'],
})
export class AddVehicleModalComponent implements OnInit {
  vehicleForm!: FormGroup;
  submitted: boolean = false;

  carBrands: string[] = [];
  carModels: string[] = [];
  carColors: string[] = [];
  carProductionYear: number[] = [];
  carBodyTypes: string[] = [];
  carFuelTypes: string[] = [];

  maxDate: string = '';

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private fleetDataService: fleetDataService,
  ) {
    this.setMaxDate();
  }

  ngOnInit() {
    this.initializeForm();
    this.populateDropdowns();
  }

  initializeForm() {
    this.vehicleForm = this.formBuilder.group({
      vin: ['', Validators.required],
      mileage: ['', Validators.required],
      brand: [null, Validators.required],
      model: [{ value: null, disabled: true }, Validators.required],
      bodyType: ['', Validators.required],
      fuelType: ['', Validators.required],
      year: ['', Validators.required],
      color: ['', Validators.required],
      isHeritageListed: [false, Validators.required],
      technicalInspectionDate: [this.maxDate, Validators.required],
      registrationNumber: [''],
      insuranceExpiryDate: [this.maxDate, Validators.required],
    });

    this.vehicleForm.get('brand')?.valueChanges.subscribe((value) => {
      if (value) {
        this.vehicleForm.get('model')?.enable();
      } else {
        this.vehicleForm.get('model')?.disable();
      }
    });
  }

  setMaxDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.maxDate = `${year}-${month}-${day}`;
  }

  populateDropdowns(): void {
    this.carBrands = this.fleetDataService
      .getBrandName()
      .map((bran) => bran.brand);
    this.carBrands.sort((a, b) => a.localeCompare(b));
    this.carBodyTypes = this.fleetDataService
      .getBodyTypes()
      .map((type) => type.body_type);
    this.carFuelTypes = this.fleetDataService
      .getFuelTypes()
      .map((type) => type.fuel_type);
    this.carColors = this.fleetDataService.getColors().map((color) => color.color);

    const currentYear = new Date().getFullYear();
    const oldestYear = currentYear - 30 - 50;
    for (let i = currentYear - 30; i >= oldestYear; i--) {
      this.carProductionYear.push(i);
    }
  }

  //Filtrowanie modeli wg marki
  filterModels() {
    if (!this.vehicleForm.get('brand')) {
      this.carModels = [];
      this.vehicleForm.get('model')?.setValue(null);
      return;
    }
    this.carModels = this.fleetDataService.getModelForBrand(
      this.vehicleForm.get('brand')?.value
    );
    this.vehicleForm.get('model')?.setValue(null);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  //Wyślij formularz
  submitForm() {
    if (this.vehicleForm.valid) {
      this.modalController.dismiss(this.vehicleForm.value);
    }
  }
}
