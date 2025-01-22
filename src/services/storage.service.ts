import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: Storage | null = null;

  constructor(private storageAngular: Storage) {}

  async init() {
    if (!this.storage) {
      this.storage = await this.storageAngular.create();
    }
  }

  async get(key: string) {
    await this.init();
    const value = await this.storage?.get(key);
    return value;
  }

  async set(key: string, value: any) {
    await this.init();
    await this.storage?.set(key, value);
  }

  async remove(key: string) {
    await this.init();
    await this.storage?.remove(key);
  }
}
