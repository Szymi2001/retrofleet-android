import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { TranslateModule } from '@ngx-translate/core';
import { ProfilePickerModalComponent } from './profile-picker-modal/profile-picker-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ImageCropperComponent,
    TranslateModule
  ],
  declarations: [ProfilePage, ProfilePickerModalComponent]
})
export class ProfilePageModule {}
