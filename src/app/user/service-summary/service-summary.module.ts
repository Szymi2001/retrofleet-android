import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceSummaryPageRoutingModule } from './service-summary-routing.module';

import { ServiceSummaryPage } from './service-summary.page';
import { BaseChartDirective } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceSummaryPageRoutingModule,
    BaseChartDirective
  ],
  declarations: [ServiceSummaryPage]
})
export class ServiceSummaryPageModule {}
