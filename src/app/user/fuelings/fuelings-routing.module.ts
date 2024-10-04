import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FuelingsPage } from './fuelings.page';

const routes: Routes = [
  {
    path: '',
    component: FuelingsPage,
    children: [
      {
        path: 'list',
        loadChildren: () => import('../add-fueling/add-fueling.module').then(m => m.AddFuelingPageModule)
      },
      {
        path: 'summary',
        loadChildren: () => import('../fueling-summary/fueling-summary.module').then(m => m.FuelingSummaryPageModule)
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
export class FuelingsPageRoutingModule {}
