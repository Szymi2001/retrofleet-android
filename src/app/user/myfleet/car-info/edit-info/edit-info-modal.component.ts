import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info-modal.component.html',
  styleUrls: ['./edit-info-modal.component.scss'],
})
export class EditInfoModalComponent {
  @Input() carObject: any;

  constructor(private modalController: ModalController) { }

  dismiss() {
    this.modalController.dismiss();
  }
}
