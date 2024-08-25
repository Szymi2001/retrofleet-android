import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddServicePageRoutingModule } from './add-service-routing.module';

import { AddServicePage } from './add-service.page';
import { NewServiceComponent } from './new-service/new-service.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddServicePageRoutingModule
  ],
  declarations: [AddServicePage, NewServiceComponent]
})
export class AddServicePageModule {}
