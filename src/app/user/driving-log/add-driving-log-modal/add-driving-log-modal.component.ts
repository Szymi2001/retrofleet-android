import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { FleetService } from 'src/services/endpoints/fleetEndpoint.service';

interface Route {
  user_id: string | null;
  car_id: string;
  brand: string;
  model: string;
  start_location: string;
  end_location: string;
  distance: string;
  duration: string;
  status: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-new-driving-log',
  templateUrl: './add-driving-log-modal.component.html',
  styleUrls: ['./add-driving-log-modal.component.scss'],
})
export class AddDrivingLogModal implements OnInit {
  private userId = localStorage.getItem('userId');

  vehicleStrings: any[] = [];
  receivedData: any[] = [];

  //Google place API
  filteredStartCities: any[] = [];
  filteredEndCities: any[] = [];
  distance: string | null = null;
  duration: string | null = null;

  submitted = false;
  routeForm!: FormGroup;

  myRoutes: Route[] = [];

  minDate = new Date().toISOString();
  maxDate = new Date().toISOString();

  statusOptions = [
    { label: 'Zaplanowana', value: 'Planned' },
    { label: 'W trakcie', value: 'InProgress' },
    { label: 'Zakończona', value: 'Ended' },
  ];

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private fleetService: FleetService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadVehicleData();
  }

  //TODO: Zaplanowana data może być tylko od następnego dnia itp.
  initializeForm(): void {
    this.routeForm = this.formBuilder.group({
      selectedCar: ['', Validators.required],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      distance: [null, Validators.required],
      duration: [null, Validators.required],
      status: ['', Validators.required],
      date: [{ value: this.maxDate, disabled: true } , Validators.required],
      description: [''],
    });

    this.routeForm.get('status')?.valueChanges.subscribe((value) => {
      if (value) {
        this.routeForm.get('date')?.enable();
      } else {
        this.routeForm.get('date')?.disable();
      }
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

  updateVehicleStrings(): void {
    this.vehicleStrings = this.receivedData.slice(0, 5).map((vehicle) => ({
      label: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      value: vehicle,
    }));
  }

  async onStartCityInput(event: any) {
    const query = event.detail.value;
    if (query.length > 2) {
      this.filteredStartCities = await this.getCities(query);
    } else {
      this.filteredStartCities = [];
    }
  }

  async onEndCityInput(event: any) {
    const query = event.detail.value;
    if (query.length > 2) {
      this.filteredEndCities = await this.getCities(query);
      console.log(this.filteredEndCities)
    } else {
      this.filteredEndCities = [];
    }
  }

  selectStartCity(city: any) {
    this.routeForm.patchValue({
      startLocation: city.label,
    });
    this.filteredStartCities = [];
  }

  selectEndCity(city: any) {
    this.routeForm.patchValue({
      endLocation: city.label,
    });
    this.filteredEndCities = [];
  }

  async getCities(query: string): Promise<any[]> {
    try {
      const response = await axios.get(
        'http://localhost:3000/googlePlaces/getCities',
        {
          params: {
            query: query,
          },
        }
      );
      console.log(response)
      return response.data;
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
      throw error;
    }
  }

  async calculateDistance(): Promise<void> {
    const startLocation = this.routeForm.get('startLocation')?.value;
    const endLocation = this.routeForm.get('endLocation')?.value;

    if (!startLocation || !endLocation) {
      return;
    }

    try {
      const response = await axios.get(
        'http://localhost:3000/googlePlaces/getDistance',
        {
          params: {
            startLocation: startLocation,
            endLocation: endLocation,
          },
        }
      );

      const { distance, duration } = response.data;

      this.routeForm.patchValue({
        distance: distance,
        duration: duration,
      });
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  isRoutePlanned(): void {
    const status = this.routeForm.get('status')?.value;

    const todayISO = new Date().toISOString();
    const futureISO = new Date(new Date().setFullYear(new Date().getFullYear() + 100)).toISOString();

    switch(status.value) {
      case 'Planned':
        this.minDate = todayISO;
        this.maxDate = futureISO;
        break;
      case 'InProgress':
        this.minDate = todayISO;
        this.maxDate = todayISO;
        break;
      case 'Ended':
        this.minDate = '1900-01-01';
        this.maxDate = todayISO;
        break;
      default:
        this.minDate = todayISO;
        this.maxDate = futureISO;
    }
  }

  submitForm() {
    this.submitted = true;

    this.routeForm.markAllAsTouched();
    
    if (this.routeForm.valid) {
      this.modalController.dismiss(this.routeForm.value);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
