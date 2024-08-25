import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FuelingSummaryPage } from './fueling-summary.page';

const routes: Routes = [
  {
    path: '',
    component: FuelingSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FuelingSummaryPageRoutingModule {}
