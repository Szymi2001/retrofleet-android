import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

<<<<<<<< HEAD:src/app/tabs/settings/settings.module.ts
import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
========
import { FuelingSummaryPageRoutingModule } from './fueling-summary-routing.module';

import { FuelingSummaryPage } from './fueling-summary.page';
>>>>>>>> 2108c01 (module settings, more translations):src/app/user/fueling-summary/fueling-summary.module.ts

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
<<<<<<<< HEAD:src/app/tabs/settings/settings.module.ts
    SettingsPageRoutingModule
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
========
    FuelingSummaryPageRoutingModule
  ],
  declarations: [FuelingSummaryPage]
})
export class FuelingSummaryPageModule {}
>>>>>>>> 2108c01 (module settings, more translations):src/app/user/fueling-summary/fueling-summary.module.ts
