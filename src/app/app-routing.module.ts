import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('../app/tabs/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./tabs/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'myfleet',
    loadChildren: () => import('../app/user/myfleet/car-info/car-info.module').then(m => m.CarInfoPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./user/calendar/calendar.module').then( m => m.CalendarPageModule)
  },
  {
    path: 'driving-log',
    loadChildren: () => import('./user/driving-log/driving-log.module').then( m => m.DrivingLogPageModule)
  },
  {
    path: 'add-service',
    loadChildren: () => import('./user/add-service/add-service.module').then( m => m.AddServicePageModule)
  },
  {
    path: 'add-fueling',
    loadChildren: () => import('./user/add-fueling/add-fueling.module').then( m => m.AddFuelingPageModule)
  },
  {
    path: 'service-summary',
    loadChildren: () => import('./user/service-summary/service-summary.module').then( m => m.ServiceSummaryPageModule)
  },
  {
    path: 'fueling-summary',
    loadChildren: () => import('./user/fueling-summary/fueling-summary.module').then( m => m.FuelingSummaryPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [
    RouterModule
  ],
})

export class AppRoutingModule { }
