import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FleetService {
  private baseUrl = environment.backendUrl;

  async getVehicles(userId: string): Promise<any> {
    try {
      console.log(this.baseUrl)
      const response = await axios.get(
        `${this.baseUrl}/fleet/getVehicles/${userId}`
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async addVehicle(newCar: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/fleet/addVehicle`,
        newCar
      );
      return response.data;
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
      this.handleError(error);
      throw error;
    }
  }

  async deleteVehicle(carId: string): Promise<any> {
    try {
      await axios.delete(`${this.baseUrl}/fleet/deleteVehicle/${carId}`);
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any) {
    console.error('Błąd serwera:', error);
    if (error.response) {
      console.error(`Serwer zwrócił kod ${error.response.status}, odpowiedź: ${error.response.data}`);
    } else if (error.request) {
      console.error('Żądanie zostało wysłane, ale brak odpowiedzi od serwera:', error.request);
    } else {
      console.error('Błąd podczas konfiguracji żądania:', error.message);
    }
  }
}
