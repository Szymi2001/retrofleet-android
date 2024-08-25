import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddFuelingPageRoutingModule } from './add-fueling-routing.module';

import { AddFuelingPage } from './add-fueling.page';
import { NewFuelingComponent } from './new-fueling/new-fueling.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddFuelingPageRoutingModule
  ],
  declarations: [AddFuelingPage, NewFuelingComponent]
})
export class AddFuelingPageModule {}
