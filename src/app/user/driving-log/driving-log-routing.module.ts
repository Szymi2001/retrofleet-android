import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DrivingLogPage } from './driving-log.page';

const routes: Routes = [
  {
    path: '',
    component: DrivingLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrivingLogPageRoutingModule {}
