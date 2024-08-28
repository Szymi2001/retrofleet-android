import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarInfoPageRoutingModule } from './car-info-routing.module';

import { CarInfoPage } from './car-info.page';
import { MoreOptionsComponent } from './more-options/more-options.component';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { EditInfoComponent } from './edit-info/edit-info.component';
<<<<<<< HEAD
=======
import { TranslateModule } from '@ngx-translate/core';
>>>>>>> 2108c01 (module settings, more translations)

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarInfoPageRoutingModule,
<<<<<<< HEAD
    ImageCropperComponent
=======
    ImageCropperComponent,
    TranslateModule
>>>>>>> 2108c01 (module settings, more translations)
  ],
  declarations: [CarInfoPage, MoreOptionsComponent, ImagePickerComponent, EditInfoComponent],
  providers: [DatePipe]
})
export class CarInfoPageModule {}
