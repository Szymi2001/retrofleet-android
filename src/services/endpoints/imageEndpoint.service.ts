import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private baseUrl = environment.backendUrl;

  async uploadImage(userId: any, carId: any, formData: FormData): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/image/upload`,
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

  async downloadImages(userId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/image/download/${userId}`
      );
      return response.data.images;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteImage(userId: any, carId: any): Promise<any> {
    try {
        const response = await axios.delete(
            `${this.baseUrl}/image/delete/${userId}/${carId}`
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
