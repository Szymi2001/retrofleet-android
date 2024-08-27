import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DrivingLogPageRoutingModule } from './driving-log-routing.module';
import { DrivingLogPage } from './driving-log.page';
import { NewDrivingLogComponent } from './new-driving-log/new-driving-log.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    DrivingLogPageRoutingModule
  ],
  declarations: [DrivingLogPage, NewDrivingLogComponent]
})
export class DrivingLogPageModule {}
