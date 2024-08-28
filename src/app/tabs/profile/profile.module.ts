import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
<<<<<<< HEAD
=======
import { TranslateModule } from '@ngx-translate/core';
>>>>>>> 2108c01 (module settings, more translations)

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
<<<<<<< HEAD
    ProfilePageRoutingModule
=======
    ProfilePageRoutingModule,
    TranslateModule
>>>>>>> 2108c01 (module settings, more translations)
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
