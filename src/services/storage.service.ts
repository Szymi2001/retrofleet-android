import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: Storage | null = null;

  constructor(private storageAngular: Storage) {
    this.init();
  }

  async init() {
    this.storage = await this.storageAngular.create();
  }

  async get(key: string) {
    return this.storage?.get(key);
    
  }

  async set(key: string, value: any) {
    await this.storage?.set(key, value);
  }

  async remove(key: string) {
    await this.storage?.remove(key);
  }
}
