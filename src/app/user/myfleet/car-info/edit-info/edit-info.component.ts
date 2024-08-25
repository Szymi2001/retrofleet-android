import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.scss'],
})
export class EditInfoComponent  implements OnInit {
  @Input() carProperties: any;

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.carProperties)
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
