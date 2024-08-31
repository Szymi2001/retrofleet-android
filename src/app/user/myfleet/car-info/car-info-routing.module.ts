import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarInfoPage } from './car-info.page';

const routes: Routes = [
  {
    path: '',
    component: CarInfoPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarInfoPageRoutingModule {}
