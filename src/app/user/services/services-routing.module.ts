import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesPage } from './services.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesPage,
    children: [
      {
        path: 'list',
        loadChildren: () => import('../add-service/add-service.module').then(m => m.AddServicePageModule)
      },
      {
        path: 'summary',
        loadChildren: () => import('../service-summary/service-summary.module').then(m => m.ServiceSummaryPageModule)
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesPageRoutingModule {}
