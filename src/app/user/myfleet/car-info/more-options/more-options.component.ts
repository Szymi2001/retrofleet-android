import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ImagePickerComponent } from '../image-picker/image-picker.component';
import { EditInfoComponent } from '../edit-info/edit-info.component';
import { ImageService } from 'src/services/imageService.service';
import { FleetService } from 'src/services/fleetService.service';
import { CarService } from 'src/services/carService.service';

@Component({
  selector: 'app-more-options',
  templateUrl: './more-options.component.html',
  styleUrls: ['./more-options.component.scss'],
})
export class MoreOptionsComponent {
  @Input() carProperties: any;
  @Input() dismissPopover!: () => Promise<void>;
  @Output() onRemove = new EventEmitter<string>();
  private userId = localStorage.getItem('userId');

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private imageService: ImageService,
    private fleetService: FleetService,
    private carService: CarService
  ) {}

  async openImagePicker() {
    const modal = await this.modalController.create({
      component: ImagePickerComponent,
      componentProps: {
        carId: this.carProperties._id,
      },
    });
    return await modal.present();
  }

  async openEditInfo() {
    const modal = await this.modalController.create({
      component: EditInfoComponent,
      componentProps: {
        carProperties: this.carProperties,
      },
    });
    return await modal.present();
  }

  async presentDeleteConfirmation(carId: string) {
    const alert = await this.alertController.create({
      header: 'Potwierdzenie usunięcia',
      message: 'Czy na pewno chcesz usunąć ten pojazd?',
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Usuń',
          handler: async () => {
            await this.deleteCar(carId);
          },
        },
      ],
    });

    await alert.present();
  }

  async deleteCar(carId: string) {
    try {
      // Usunięcie pojazdu
      await this.fleetService.deleteVehicle(carId);
      // Usunięcie zdjęć
      await this.imageService.deletePhoto(this.userId!, carId);

      this.carService.setCarToRemove(carId);

      // Zamknięcie popoveru
      await this.dismissPopover();
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }
  
  async handleEditInfo() {
    await this.openEditInfo();
    await this.dismissPopover();
  }

  async handleImagePicker() {
    await this.openImagePicker();
    await this.dismissPopover();
  }

  async handleDelete() {
    const carId = this.carProperties._id;
    await this.presentDeleteConfirmation(carId);
  }

  async dismiss() {
    await this.dismissPopover();
  }
}
