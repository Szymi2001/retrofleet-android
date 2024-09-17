import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarInfoPageRoutingModule } from './car-info-routing.module';

import { CarInfoPage } from './car-info.page';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { ImagePickerComponent } from './image-picker-modal/image-picker-modal.component';
import { EditInfoModalComponent } from './edit-info/edit-info-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { AddVehicleModalComponent } from './add-vehicle-modal/add-vehicle-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CarInfoPageRoutingModule,
    ImageCropperComponent,
    TranslateModule
  ],
  declarations: [CarInfoPage, AddVehicleModalComponent, ImagePickerComponent, EditInfoModalComponent],
  providers: [DatePipe]
})
export class CarInfoPageModule {}
