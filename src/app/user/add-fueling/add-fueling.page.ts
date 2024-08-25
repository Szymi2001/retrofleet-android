import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NewFuelingComponent } from './new-fueling/new-fueling.component';

@Component({
  selector: 'app-add-fueling',
  templateUrl: './add-fueling.page.html',
  styleUrls: ['./add-fueling.page.scss'],
})
export class AddFuelingPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  async openDialog() {
    const modal = await this.modalController.create({
      component: NewFuelingComponent,
    });
    return await modal.present();
  }

}
