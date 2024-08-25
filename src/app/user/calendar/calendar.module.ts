import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePL from '@angular/common/locales/pl';
registerLocaleData(localePL, 'pl');
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarPageRoutingModule } from './calendar-routing.module';

import { CalendarPage } from './calendar.page';
import { NgCalendarModule } from 'ionic8-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CalendarPageRoutingModule,
    NgCalendarModule
  ],
  declarations: [CalendarPage],
  providers: [{ provide: LOCALE_ID, useValue: 'pl'}]
})
export class CalendarPageModule {}
