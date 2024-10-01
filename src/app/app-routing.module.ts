import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { GuestGuard } from 'src/guards/guest.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadChildren: () =>
      import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    canActivate: [GuestGuard],
    loadChildren: () =>
      import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadChildren: () => import('../app/tabs/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./tabs/settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'myfleet',
    canActivate: [AuthGuard],
    loadChildren: () => import('../app/user/myfleet/car-info/car-info.module').then(m => m.CarInfoPageModule)
  },
  {
    path: 'calendar',
    canActivate: [AuthGuard],
    loadChildren: () => import('./user/calendar/calendar.module').then( m => m.CalendarPageModule)
  },
  {
    path: 'driving-log',
    canActivate: [AuthGuard],
    loadChildren: () => import('./user/driving-log/driving-log.module').then( m => m.DrivingLogPageModule)
  },
  {
    path: 'add-service',
    canActivate: [AuthGuard],
    loadChildren: () => import('./user/add-service/add-service.module').then( m => m.AddServicePageModule)
  },
  {
    path: 'add-fueling',
    canActivate: [AuthGuard],
    loadChildren: () => import('./user/add-fueling/add-fueling.module').then( m => m.AddFuelingPageModule)
  },
  {
    path: 'services',
    loadChildren: () => import('./user/services/services.module').then( m => m.ServicesPageModule),
  },

  // {
  //   path: 'service-summary',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./user/service-summary/service-summary.module').then( m => m.ServiceSummaryPageModule)
  // },
  // {
  //   path: 'fueling-summary',
  //   canActivate: [AuthGuard],
  //   loadChildren: () => import('./user/fueling-summary/fueling-summary.module').then( m => m.FuelingSummaryPageModule)
  // }

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
