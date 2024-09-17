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
  getCarStatus(): number {
    const isHeritageListed = this.carData.is_heritage_listed;
    const technicalInspectionDate =
      this.carData.technical_inspection_date;
    const registrationNumber = this.carData.registration_number;
    const insuranceExpiryDate = this.carData.insurance_expiry_date;

    function calculatePercentage(
      isHeritageListed: boolean,
      technicalInspectionDate: any,
      insuranceExpiryDate: any,
      registrationNumber: string
    ): number {
      let percentage = 0;

      if (isHeritageListed) {
        percentage += 25;
      }

      if (technicalInspectionDate !== null) {
        percentage += 25;
      }

      if (insuranceExpiryDate !== null) {
        percentage += 25;
      }

      if (registrationNumber !== null && registrationNumber !== '') {
        percentage += 25;
      }

      return percentage;
    }

    const calculatedPercentage = calculatePercentage(
      isHeritageListed,
      technicalInspectionDate,
      insuranceExpiryDate,
      registrationNumber
    );

    return calculatedPercentage;
  }

  getStatusLabel(): string {
    const percentage = this.getCarStatus();
  
    if (percentage >= 75) {
      return 'W bardzo dobrym stanie';
    } else if (percentage >= 50) {
      return 'W dobrym stanie';
    } else if (percentage >= 25) {
      return 'Wymaga uwagi';
    } else {
      return 'Stan nieokreślony';
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
