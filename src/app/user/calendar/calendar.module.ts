import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
registerLocaleData(localePL, 'pl');
registerLocaleData(localeEN, 'en');
import localeEN from '@angular/common/locales/en';
import localePL from '@angular/common/locales/pl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { IonCalendarModule } from '@heliomarpm/ion-calendar';
import { CalendarPageRoutingModule } from './calendar-routing.module';
import { CalendarPage } from './calendar.page';
import { TranslateModule } from '@ngx-translate/core';
import { AddEventModalComponent } from './add-event-modal/add-event-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    IonCalendarModule,
    TranslateModule,
    CalendarPageRoutingModule,
  ],
  declarations: [CalendarPage, AddEventModalComponent],
})
export class CalendarPageModule {}
