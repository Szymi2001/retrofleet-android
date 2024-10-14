import { Component, OnInit } from '@angular/core';
import { FleetService } from 'src/services/endpoints/fleetEndpoint.service';
import { VehicleMaintenanceService } from 'src/services/endpoints/vehicleMaintenanceEndpoint.service';
import { ChartConfiguration } from 'chart.js';

interface Vehicle {
  brand: string;
  model: string;
  year: number;
}

interface Service {
  type: string;
  date: string;
  price: number;
  mileage: number;
  description: string;
}

interface TotalPriceByType {
  [key: string]: { type: string; totalPrice: number }[];
}

interface TotalPriceByMonth {
  [key: string]: { totalPrice: number }[];
}

@Component({
  selector: 'app-service-summary',
  templateUrl: './service-summary.page.html',
  styleUrls: ['./service-summary.page.scss'],
})
export class ServiceSummaryPage implements OnInit {
  private userId = localStorage.getItem('userId');

  vehicleStrings: any[] = [];
  receivedData: Vehicle[] = [];
  serviceData: Service[] = [];

  totalPriceByType: TotalPriceByType = {};
  totalPriceByMonth: TotalPriceByMonth = {};
  serviceDataMapped: any[] = [];
  totalServices: number = 0;
  mostExpensiveService: Service | null = null;

  error: string | null = null;
  selectedCar: any;
  carId: any;
  events: any[] | undefined;
  currentYear: number = 0;

  //Deklaracje dla wykresu wg. miesięcy
  priceByMonthData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      'Styczeń',
      'Luty',
      'Marzec',
      'Kwiecień',
      'Maj',
      'Czerwiec',
      'Lipiec',
      'Sierpień',
      'Wrzesień',
      'Październik',
      'Listopad',
      'Grudzień',
    ],
    datasets: [
      {
        data: [],
      },
    ],
  };

  priceByMonthOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#000',
        },
      },
    },
  };

  //Deklaracje dla wykresu wg. typu
  priceByTypeData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  };

  priceByTypeOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#000',
        },
      },
    },
  };

  constructor(
    private fleetService: FleetService,
    private vehicleMaintenanceService: VehicleMaintenanceService
  ) {
    this.currentYear = new Date().getFullYear();
  }

  async ngOnInit(): Promise<void> {
    try {
      if (this.userId) {
        this.receivedData = await this.fleetService.getVehicles(this.userId);
        this.updateVehicleStrings();
        if (this.vehicleStrings.length > 0) {
          this.selectedCar = this.vehicleStrings[0].value;
          this.getBillHistory(this.selectedCar._id);
        }
        this.error = null;
      } else {
        this.error = 'Brak ID użytkownika';
      }
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  async previousYear() {
    this.currentYear--;
    this.totalPriceByMonth =
      await this.vehicleMaintenanceService.getTotalPriceByMonth(
        this.carId,
        this.currentYear
      );
    this.updatePriceByMonthChart();
  }

  async nextYear() {
    this.currentYear++;
    this.totalPriceByMonth =
      await this.vehicleMaintenanceService.getTotalPriceByMonth(
        this.carId,
        this.currentYear
      );
    this.updatePriceByMonthChart();
  }

  updateVehicleStrings(): void {
    this.vehicleStrings = this.receivedData.slice().map((vehicle) => ({
      label: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      value: vehicle,
    }));
  }

  async getServices(carId: any) {
    try {
      this.serviceData = await this.vehicleMaintenanceService.getService(carId);
      this.calculateSummary();
      this.findMostExpensiveService();
      this.updateServiceData();
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  // Łączna kwota wydatków wg. kategorii serwisów
  async getTotalPriceByType(carId: string) {
    try {
      this.totalPriceByType =
        await this.vehicleMaintenanceService.getTotalPriceByType(carId);
      this.updatePriceByTypeChart();
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  // Łączna kwota wydatków wg. miesięcy
  async getTotalPriceByMonth(carId: string, year: number) {
    try {
      this.totalPriceByMonth =
        await this.vehicleMaintenanceService.getTotalPriceByMonth(carId, year);
      this.updatePriceByMonthChart();
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  updateServiceData() {
    this.serviceDataMapped = this.serviceData
      .slice()
      .map((service) => ({
        type: `${service.type}`,
        date: `${service.date}`,
        cost: `${service.price}`,
        mileage: `${service.mileage}`,
        desc: `${service.description}`,
      }))
      .sort(
        (a, b) =>
          this.parseDate(b.date).getTime() - this.parseDate(a.date).getTime()
      );
  }

  updatePriceByTypeChart() {
    const values = Object.values(this.totalPriceByType);
    const types = values.flatMap((innerArray) =>
      innerArray.map(({ type }: { type: string }) => type)
    );
    const totalPrice = values.flatMap((innerArray) =>
      innerArray.map(({ totalPrice }: { totalPrice: number }) => totalPrice)
    );

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--ion-text-color');

    this.priceByTypeData = {
      labels: types,
      datasets: [
        {
          label: 'Wydatki [zł]',
          data: totalPrice,
          backgroundColor: this.getChartColors('background'),
          hoverBackgroundColor: this.getChartColors('hover'),
        },
      ],
    };

    this.priceByTypeOptions = this.getChartOptionsByType(textColor);
  }

  updatePriceByMonthChart(): void {
    const values = Object.values(this.totalPriceByMonth);
    const totalPrice = values.flatMap((innerArray) =>
      innerArray.map(({ totalPrice }) => totalPrice)
    );

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--ion-text-color');

    this.priceByMonthData = {
      labels: [
        'Styczeń',
        'Luty',
        'Marzec',
        'Kwiecień',
        'Maj',
        'Czerwiec',
        'Lipiec',
        'Sierpień',
        'Wrzesień',
        'Październik',
        'Listopad',
        'Grudzień',
      ],
      datasets: [
        {
          label: 'Wydatki [zł]',
          backgroundColor: documentStyle.getPropertyValue(
            '--ion-color-primary'
          ),
          data: totalPrice,
        },
      ],
    };

    this.priceByMonthOptions = this.getChartOptionsByMonth(textColor);
  }

  getChartOptionsByType(textColor: string): any {
    return {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
    };
  }

  getChartOptionsByMonth(textColor: string): any {
    return {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
          },
        },
        y: {
          ticks: {
            color: textColor,
          },
        },
      },
    };
  }

  parseDate(dateStr: string): Date {
    const monthsMap: { [key: string]: number } = {
      styczeń: 0,
      luty: 1,
      marzec: 2,
      kwiecień: 3,
      maj: 4,
      czerwiec: 5,
      lipiec: 6,
      sierpień: 7,
      wrzesień: 8,
      październik: 9,
      listopad: 10,
      grudzień: 11,
    };
    const [day, month, year] = dateStr.split(' ');
    return new Date(parseInt(year), monthsMap[month], parseInt(day));
  }

  getChartColors(type: 'background' | 'hover'): string[] {
    const documentStyle = getComputedStyle(document.documentElement);
    const colorSets = {
      background: [
        '--ion-color-primary',
        '--ion-color-secondary',
        '--ion-color-tertiary',
        '--ion-color-success',
        '--ion-color-warning',
        '--ion-color-danger',
        '--ion-color-light',
        '--ion-color-medium',
        '--ion-color-dark',
        '--ion-custom-green-300',
        '--ion-custom-blue-300',
        '--ion-custom-red-300',
        '--ion-custom-bluegray-300',
      ],
      hover: [
        '--ion-color-primary-tint',
        '--ion-color-secondary-tint',
        '--ion-color-tertiary-tint',
        '--ion-color-success-tint',
        '--ion-color-warning-tint',
        '--ion-color-danger-tint',
        '--ion-color-light-tint',
        '--ion-color-medium-tint',
        '--ion-color-dark-tint',
        '--ion-custom-green-200',
        '--ion-custom-blue-200',
        '--ion-custom-red-200',
        '--ion-custom-bluegray-200',
      ],
    };

    const colorKeys = colorSets[type];

    return colorKeys.map((key) => {
      const color = documentStyle.getPropertyValue(key).trim();
      if (!color) {
        console.warn(`Kolor dla klucza '${key}' jest pusty.`);
      }
      return color;
    });
  }

  calculateSummary(): void {
    this.totalServices = this.serviceData.length;
  }

  findMostExpensiveService(): void {
    if (this.serviceData.length > 0) {
      this.mostExpensiveService = this.serviceData.reduce((prev, current) =>
        current.price > prev.price ? current : prev
      );
    } else {
      this.mostExpensiveService = null;
    }
  }

  async getBillHistory(carId: any) {
    this.carId = carId;
    this.getServices(carId);
    this.getTotalPriceByType(carId);
    this.getTotalPriceByMonth(carId, this.currentYear);
  }
}
