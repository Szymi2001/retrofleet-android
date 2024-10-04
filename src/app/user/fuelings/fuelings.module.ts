import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FuelingsPageRoutingModule } from './fuelings-routing.module';

import { FuelingsPage } from './fuelings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FuelingsPageRoutingModule
  ],
  declarations: [FuelingsPage]
})
export class FuelingsPageModule {}
