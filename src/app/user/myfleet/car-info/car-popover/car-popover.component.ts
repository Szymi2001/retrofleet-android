import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { ImagePickerComponent } from '../image-picker-modal/image-picker-modal.component';
import { EditInfoModalComponent } from '../edit-info/edit-info-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-more-options',
  templateUrl: './car-popover.component.html',
  styleUrls: ['./car-popover.component.scss'],
})
export class CarPopoverComponent {
  private userId = localStorage.getItem('userId');
  @Input() carObject: any;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private popoverController: PopoverController,
    private translate: TranslateService
  ) {}
  
  async openImagePicker() {
    const modal = await this.modalController.create({
      component: ImagePickerComponent,
      componentProps: {
        carId: this.carObject._id,
      },
    });
    return await modal.present();
  }

  async openEditInfo() {
    const modal = await this.modalController.create({
      component: EditInfoModalComponent,
      componentProps: {
        carObject: this.carObject,
      },
    });
    return await modal.present();
  }

  async presentDeleteConfirmation() {
    this.translate
      .get([
        'DELETECAR-ALERT.DELETE_CONFIRMATION_HEADER',
        'DELETECAR-ALERT.DELETE_CONFIRMATION_MESSAGE',
        'DELETECAR-ALERT.CANCEL',
        'DELETECAR-ALERT.DELETE',
      ])
      .subscribe(async (translations) => {
        const header =
          translations['DELETECAR-ALERT.DELETE_CONFIRMATION_HEADER'];
        const message =
          translations['DELETECAR-ALERT.DELETE_CONFIRMATION_MESSAGE'];
        const cancelText = translations['DELETECAR-ALERT.CANCEL'];
        const deleteText = translations['DELETECAR-ALERT.DELETE'];

        const alert = await this.alertController.create({
          header: header,
          message: message,
          buttons: [
            {
              text: cancelText,
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: deleteText,
              handler: async () => {
                //await this.deleteCar(carId);
              },
            },
          ],
        });

        await alert.present();
      });
  }

  // async deleteCar(carId: string) {
  //   try {
  //     // Usunięcie pojazdu
  //     await this.fleetService.deleteVehicle(carId);
  //     // Usunięcie zdjęć
  //     await this.imageService.deletePhoto(this.userId!, carId);

  //     this.carService.setCarToRemove(carId);

  //     // Zamknięcie popoveru
  //     await this.dismissPopover();
  //   } catch (error: any) {
  //     console.error('Błąd:', error.response?.data || error.message);
  //   }
  // }

  // async handleDelete() {
  //   const carId = this.carProperties._id;
  //   await this.presentDeleteConfirmation(carId);
  // }

  async dismiss() {
    await this.popoverController.dismiss();
  }
}
