import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = 'http://192.168.0.154:3000';

  async updateUserInfo(userId: any, name: string, surname: string): Promise<any> {
    try {
        const response = await axios.post(`${this.baseUrl}/profile/updateUserInfo`, { userId, name, surname });
      } catch (error: any) {
        this.handleError(error);
        throw error;
      }
  }

  async getUserInfo(userId: any): Promise<any> {
    try {
        const response = await axios.get(
          `${this.baseUrl}/profile/getUserInfo/${userId}`
        );
        return response.data;
      } catch (error: any) {
        this.handleError(error);
        throw error;
      }
  }

  async updatePassword(userId: any, old_password: string, new_password: string): Promise<any> {
    try {
        const response = await axios.post(
            `${this.baseUrl}/users/changePassword`, { userId, old_password, new_password }
        );
        return response.data;
    } catch (error: any) {
        this.handleError(error);
        throw error;
    }
  }

  async setRemindQuestions(userId: any, first_question: string, first_answer: string, second_question: string, second_answer: string): Promise<any> {
    try {
      const response = await axios.post(
          `${this.baseUrl}/profile/setRemindQuestions`, { userId, first_question, first_answer, second_question, second_answer }
      );
      return response.data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async getRemindQuestions(userId: any): Promise<any> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/profile/getRemindQuestions`, {
          params: { userId }
        });
        return response.data;
    } catch (error: any) {
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
