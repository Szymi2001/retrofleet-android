import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddFuelingPage } from './add-fueling.page';

const routes: Routes = [
  {
    path: '',
    component: AddFuelingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddFuelingPageRoutingModule {}
