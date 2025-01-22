import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info-modal.component.html',
  styleUrls: ['./edit-info-modal.component.scss'],
})
export class EditInfoModalComponent {
  @Input() carData: any;

  constructor(private modalController: ModalController) { }

  //Dane do progressbar
  

  // getStatusLabel(): string {
  //   const percentage = this.getCarStatus();
  
  //   if (percentage >= 75) {
  //     return 'W bardzo dobrym stanie';
  //   } else if (percentage >= 50) {
  //     return 'W dobrym stanie';
  //   } else if (percentage >= 25) {
  //     return 'Wymaga uwagi';
  //   } else {
  //     return 'Stan nieokreślony';
  //   }
  // }

  dismiss() {
    this.modalController.dismiss();
  }
}
