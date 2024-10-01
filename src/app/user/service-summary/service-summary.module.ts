import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceSummaryPageRoutingModule } from './service-summary-routing.module';

import { ServiceSummaryPage } from './service-summary.page';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceSummaryPageRoutingModule,
    NgChartsModule
  ],
  declarations: [ServiceSummaryPage]
})
export class ServiceSummaryPageModule {}
