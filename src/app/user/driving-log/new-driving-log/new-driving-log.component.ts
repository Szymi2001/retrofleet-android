import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import axios from 'axios';
import { FleetService } from 'src/services/fleetService.service';

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
  templateUrl: './new-driving-log.component.html',
  styleUrls: ['./new-driving-log.component.scss'],
})
export class NewDrivingLogComponent implements OnInit {
  private userId = localStorage.getItem('userId');
  private apiKey: string = 'AIzaSyANgW5cskfKiJbsiv-3xPSTDwYvNOKg3ic';

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

  initializeForm(): void {
    this.routeForm = this.formBuilder.group({
      selectedCar: ['', Validators.required],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      distance: [{ value: null, disabled: true }, Validators.required],
      duration: [{ value: null, disabled: true }, Validators.required],
      status: ['', Validators.required],
      date: [null, Validators.required],
      description: [''],
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
        `/google-api/maps/api/place/autocomplete/json`,
        {
          params: {
            input: query,
            types: '(cities)',
            key: this.apiKey,
            language: 'pl',
          },
        }
      );
      return response.data.predictions.map((prediction: any) => ({
        label: prediction.description,
        value: prediction.description,
      }));
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
      return [];
    }
  }

  async calculateDistance() {
    const startLocation = this.routeForm.get('startLocation')?.value;
    const endLocation = this.routeForm.get('endLocation')?.value;

    if (!startLocation || !endLocation) {
      return;
    }

    try {
      const response = await axios.get(
        `/google-api/maps/api/distancematrix/json`,
        {
          params: {
            origins: startLocation,
            destinations: endLocation,
            key: this.apiKey,
            language: 'pl',
          },
        }
      );

      const element = response.data.rows[0].elements[0];
      if (element.status === 'OK') {
        this.distance = (element.distance.value / 1000).toFixed(2);
        this.duration = element.duration.text;

        this.routeForm.patchValue({
          distance: this.distance + ' km',
          duration: this.duration,
        });
      } else {
        console.error('Nie można obliczyć odległości.');
        this.distance = null;
        this.duration = null;
      }
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
      this.distance = null;
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const monthName = MONTHS[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${monthName} ${year}`;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.routeForm.invalid) {
      return;
    }

    const newRoute = this.buildNewRoute();

    try {
      //await this.routeService.addRoute(newRoute);
      this.myRoutes.push(newRoute);
      console.log(newRoute)
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  buildNewRoute(): Route {
    const selectedCar = this.routeForm.get('selectedCar')?.value;

    const date = new Date(this.routeForm.get('date')?.value);
    const status = this.routeForm.get('status')?.value;

    return {
      user_id: this.userId,
      car_id: selectedCar.value._id,
      brand: selectedCar.value.brand,
      model: selectedCar.value.model,
      start_location: this.routeForm.get('startLocation')?.value,
      end_location: this.routeForm.get('endLocation')?.value,
      distance: this.routeForm.get('distance')?.value,
      duration: this.routeForm.get('duration')?.value,
      status: status.label,
      date: this.formatDate(date),
      description: this.routeForm.get('description')?.value,
    };
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
