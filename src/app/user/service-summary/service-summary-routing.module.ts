import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceSummaryPage } from './service-summary.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceSummaryPageRoutingModule {}
