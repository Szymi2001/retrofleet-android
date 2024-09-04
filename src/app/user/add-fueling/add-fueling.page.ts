import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddFuelingModalComponent } from './add-fueling-modal/add-fueling-modal.component';

@Component({
  selector: 'app-add-fueling',
  templateUrl: './add-fueling.page.html',
  styleUrls: ['./add-fueling.page.scss'],
})
export class AddFuelingPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  async openAddFuelingModal() {
    const modal = await this.modalController.create({
      component: AddFuelingModalComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.addFueling(data.data);
      }
    });
    return await modal.present();
  }

  async addFueling(fuelingData: any): Promise<void> {
    console.info(fuelingData)
  }

}
