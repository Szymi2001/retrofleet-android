import { Injectable } from '@angular/core';
import axios from 'axios';
import { backend_Url } from 'src/app/app.component';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private baseUrl = backend_Url;

  async uploadCarImage(userId: any, carId: any, formData: FormData): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/carImage/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'user-id': userId,
            'car-id': carId,
          },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async uploadProfileImage(userId: any, formData: FormData): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/profileImage/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'user-id': userId,
          },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async downloadCarPhotos(userId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/carImage/download/${userId}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async downloadProfileImage(userId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/carImage/download/${userId}`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deletePhoto(userId: any, carId: any): Promise<any> {
    try {
        const response = await axios.delete(
            `${this.baseUrl}/carImage/delete/${userId}/${carId}`
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
