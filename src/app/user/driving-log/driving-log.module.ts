import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DrivingLogPageRoutingModule } from './driving-log-routing.module';
import { DrivingLogPage } from './driving-log.page';
import { AddDrivingLogModal } from './add-driving-log-modal/add-driving-log-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DrivingLogPageRoutingModule
  ],
  declarations: [DrivingLogPage, AddDrivingLogModal]
})
export class DrivingLogPageModule {}
