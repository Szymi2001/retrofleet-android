import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewCarPageRoutingModule } from './new-car-routing.module';

import { NewCarPage } from './new-car.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewCarPageRoutingModule
  ],
  declarations: [NewCarPage]
})
export class NewCarPageModule {}
