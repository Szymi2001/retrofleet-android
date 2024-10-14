import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehicleMaintenanceService {
  private baseUrl = environment.backendUrl;

  async addService(newService: any): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/service/addService`,
        newService
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async getService(carId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/service/getService/${carId}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getServices(userId: any): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/service/getServices/${userId}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteService(serviceId: any): Promise<any> {
    try {
      const response = await axios.delete(
        `${this.baseUrl}/service/deleteService/${serviceId}`
      );
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
   
  async updateMileage(vehicleId: any, mileage: any): Promise<any> {
    try {
      const response = await axios.put(
        `${this.baseUrl}/fleet/updateMileage/${vehicleId}`,
        { mileage }
      );
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getTotalPriceByType(carId: any): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/service/getTotalPriceByType/${carId}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getTotalPriceByMonth(carId: any, year: number): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/service/getTotalPriceByMonth/${carId}`,
        {
          params: {
            year: year
          }
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any) {
    console.error('Błąd serwera:', error);
    if (error.response) {
      console.error(
        `Serwer zwrócił kod ${error.response.status}, odpowiedź: ${error.response.data}`
      );
    } else if (error.request) {
      console.error(
        'Żądanie zostało wysłane, ale brak odpowiedzi od serwera:',
        error.request
      );
    } else {
      console.error('Błąd podczas konfiguracji żądania:', error.message);
    }
  }
}
