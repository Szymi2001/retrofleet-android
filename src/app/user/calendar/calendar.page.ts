import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  addYears,
  eachDayOfInterval,
  format,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
} from 'date-fns';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  CalendarComponent,
  ICalendarComponentOptions,
  IDayConfig,
} from '@heliomarpm/ion-calendar';
import { AppSettingsService } from 'src/services/appSettings.service';
import { EventService } from 'src/services/endpoints/eventEndpoint.service';
import { AddEventModalComponent } from './add-event-modal/add-event-modal.component';
import { StorageService } from 'src/services/storage.service';

interface Event {
  _id?: string;
  user_id: string | null;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})

export class CalendarPage implements OnInit {
  @ViewChild(CalendarComponent) calendarRef!: CalendarComponent;

  events: Event[] = [];
  selectedDate!: Date | Date[];
  selectedDateEvents: any[] = [];
  currentEvent: Event | null = null;
  date!: string;
  format = 'yyyy-MM-dd';
  options!: ICalendarComponentOptions;
  userId!: string;

  constructor(
    private eventService: EventService,
    private modalController: ModalController,
    private appSettings: AppSettingsService,
    private translate: TranslateService,
    private storageService: StorageService
  ) {
    const settings = this.appSettings.loadSettings();
    this.options = this.initializeCalendarOptions(settings.language);
    this.setDayToday();
  }

  async ngOnInit(): Promise<void> {
    await this.storageService.init();
    this.userId = await this.storageService.get('userId');
    this.loadEvents();

    this.translate.onLangChange.subscribe(() => {
      this.setLocale(this.translate.currentLang);
    });
  }

  private initializeCalendarOptions(lang: string): ICalendarComponentOptions {
    return {
      pickMode: 'single',
      locale: { locale: lang, weekdays: 'short' },
      showToggleButtons: true,
      color: 'primary',
      showAdjacentMonthDay: false,
      showMonthPicker: true,
      showYearPicker: true,
      displayMode: 'month',
      from: new Date(1900, 0, 1),
      to: addYears(new Date(), 1)
    };
  }

  async openAddEventModal() {
    const modal = await this.modalController.create({
      component: AddEventModalComponent,
      componentProps: { selectedDate: this.date }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.addEvent(data.data);
      }
    });

    return await modal.present();
  }

  private setDayToday() {
    this.date = new Date().toISOString().substring(0, 10);
  }

  onChange(event: any) {
    this.date = event;
    this.loadEventsForSelectedDate(this.date);
  }

  private loadEventsForSelectedDate(date: string) {
    const selectedDate = parseISO(date);
    this.selectedDateEvents = this.events.filter(event => this.isDateInRange(selectedDate, event));
  }

  private isDateInRange(selectedDate: Date, event: Event): boolean {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);

    return (
      (isEqual(selectedDate, startDate) || isAfter(selectedDate, startDate)) &&
      (isEqual(selectedDate, endDate) || isBefore(selectedDate, endDate))
    );
  }

  private setLocale(lang: string) {
    this.options.locale = { locale: lang, weekdays: 'short' };
  }

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    // Dynamiczne ustawienie języka
    return new Intl.DateTimeFormat(this.options.locale?.locale, options).format(
      new Date(date)
    );
  }

  private async loadEvents() {
    if (!this.userId) return;

    try {
      this.events = await this.eventService.getEvents(this.userId);
      this.updateCalendarDays();
      this.loadEventsForSelectedDate(this.date);
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  private updateCalendarDays() {
    const daysConfig: IDayConfig[] = this.events.flatMap(event => {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate);

      const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

      return daysInRange.map(date => ({
        date: date,
        subTitle: '●',
      }));
    });

    this.options = {
      ...this.options,
      daysConfig,
    };
  }

  private async addEvent(eventData: Event): Promise<void> {
    const newEvent = this.buildNewEvent(eventData);

    try {
      const savedEvent = await this.eventService.addEvent(newEvent);
      this.events.push(savedEvent);
      this.loadEventsForSelectedDate(this.date);
      this.updateCalendarDays();
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  private buildNewEvent(eventData: Event): Event {
    return {
      user_id: this.userId,
      title: eventData.title,
      startDate: format(eventData.startDate, 'yyyy-MM-dd'),
      endDate: format(eventData.endDate, 'yyyy-MM-dd'),
      startTime: format(eventData.startDate, 'HH:mm'),
      endTime: format(eventData.endDate, 'HH:mm'),
    };
  }

  async deleteEvent(eventData: Event) {
    if (!eventData._id) return;

    try {
      await this.eventService.deleteEvent(eventData._id);
      this.events = this.events.filter(event => event._id !== eventData._id);
      this.loadEventsForSelectedDate(this.date);
      this.updateCalendarDays();
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }
}
