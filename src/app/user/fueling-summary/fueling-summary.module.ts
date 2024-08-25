import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FuelingSummaryPageRoutingModule } from './fueling-summary-routing.module';

import { FuelingSummaryPage } from './fueling-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FuelingSummaryPageRoutingModule
  ],
  declarations: [FuelingSummaryPage]
})
export class FuelingSummaryPageModule {}
