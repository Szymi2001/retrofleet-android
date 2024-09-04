import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddServicePageRoutingModule } from './add-service-routing.module';

import { AddServicePage } from './add-service.page';
import { AddServiceModalComponent } from './add-service-modal/add-service-modal.component';
import { OnlyDigitsDirective } from '../../shared/directives/onlyDigits.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddServicePageRoutingModule
  ],
  declarations: [AddServicePage, AddServiceModalComponent, OnlyDigitsDirective]
})
export class AddServicePageModule {}
