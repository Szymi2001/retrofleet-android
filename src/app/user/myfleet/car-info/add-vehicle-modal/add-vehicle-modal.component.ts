import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { vinValidator } from 'src/app/shared/validators/formValidators';
import { fleetDataService } from 'src/services/fleetData.service';

@Component({
  selector: 'app-add-vehicle-modal',
  templateUrl: './add-vehicle-modal.component.html',
  styleUrls: ['./add-vehicle-modal.component.scss'],
})
export class AddVehicleModalComponent implements OnInit {
  private subscription!: Subscription;

  vehicleForm!: FormGroup;
  submitted: boolean = false;
  validationMessages: any = [];

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
    private translate: TranslateService
  ) {
    this.setMaxDate();
  }

  ngOnInit() {
    this.initializeForm();
    this.populateDropdowns();
    this.setValidationMessages();

    this.subscription = this.translate.onLangChange.subscribe(() => {
      this.setValidationMessages();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setValidationMessages() {
    this.translate.get('MYFLEET.ERRORS').subscribe((translations) => {
      this.validationMessages = {
        vin: [
          { type: 'required', message: translations.VIN_REQUIRED },
          { type: 'exactLength', message: translations.VIN_EXACT_LENGTH },
          { type: 'pattern', message: translations.VIN_INVALID },
        ],
        registrationNumber: [
          {
            type: 'required',
            message: translations.REGISTRATION_NUMBER_REQUIRED,
          },
          {
            type: 'pattern',
            message: translations.REGISTRATION_NUMBER_INVALID,
          },
        ],
        mileage: [{ type: 'required', message: translations.MILEAGE_REQUIRED }],
        brand: [{ type: 'required', message: translations.BRAND_REQUIRED }],
        model: [{ type: 'required', message: translations.MODEL_REQUIRED }],
        year: [{ type: 'required', message: translations.YEAR_REQUIRED }],
        color: [{ type: 'required', message: translations.COLOR_REQUIRED }],
        bodyType: [
          { type: 'required', message: translations.BODY_TYPE_REQUIRED },
        ],
        fuelType: [
          { type: 'required', message: translations.FUEL_TYPE_REQUIRED },
        ],
        technicalInspectionDate: [
          {
            type: 'required',
            message: translations.TECHNICAL_INSPECTION_DATE_REQUIRED,
          },
        ],
        insuranceExpiryDate: [
          {
            type: 'required',
            message: translations.INSURANCE_EXPIRY_DATE_REQUIRED,
          },
        ],
        isHeritageListed: [
          {
            type: 'required',
            message: translations.IS_HERITAGE_LISTED_REQUIRED,
          },
        ],
      };
    });
  }

  initializeForm() {
    this.vehicleForm = this.formBuilder.group({
      vin: [
        '',
        [
          Validators.required,
          vinValidator(17),
          Validators.pattern(/^(?!.*[IOQ]).*$/),
        ],
      ],
      registrationNumber: [
        '',
        [
          Validators.required
        ],
      ],
      mileage: ['', Validators.required],
      brand: [null, Validators.required],
      model: [{ value: null, disabled: true }, Validators.required],
      bodyType: ['', Validators.required],
      fuelType: ['', Validators.required],
      year: ['', Validators.required],
      color: ['', Validators.required],
      isHeritageListed: [false, Validators.required],
      technicalInspectionDate: [this.maxDate],
      insuranceExpiryDate: [this.maxDate],
    });

    this.vehicleForm.get('brand')?.valueChanges.subscribe((value) => {
      if (value) {
        this.vehicleForm.get('model')?.enable();
      } else {
        this.vehicleForm.get('model')?.disable();
      }
    });
  }

  setMaxDate(): void {
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
    this.carColors = this.fleetDataService
      .getColors()
      .map((color) => color.color);

    const currentYear = new Date().getFullYear();
    const oldestYear = currentYear - 30 - 50;
    for (let i = currentYear - 30; i >= oldestYear; i--) {
      this.carProductionYear.push(i);
    }
  }

  //Filtrowanie modeli wg marki
  filterModels(): void {
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

  dismiss(): void {
    this.modalController.dismiss();
  }

  //Wyślij formularz
  submitForm(): void {
    this.submitted = true;

    this.vehicleForm.markAllAsTouched();

    if (this.vehicleForm.valid) {
      this.modalController.dismiss(this.vehicleForm.value);
    }
  }
}
