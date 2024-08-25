import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DrivingLogPageRoutingModule } from './driving-log-routing.module';

import { DrivingLogPage } from './driving-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DrivingLogPageRoutingModule
  ],
  declarations: [DrivingLogPage]
})
export class DrivingLogPageModule {}
