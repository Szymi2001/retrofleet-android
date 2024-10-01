import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import axios from 'axios';
import { backend_Url } from 'src/app/app.component';
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
import { dateRangeValidator } from 'src/app/shared/validators/formValidators';

interface Event {
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
  //Adres backendu
  private baseUrl = backend_Url;

  @ViewChild(CalendarComponent) calendarRef!: CalendarComponent;

  addEvent!: FormGroup;
  validationMessages: any = [];
  submitted = false;

  events: Event[] = [];
  selectedDate!: Date | Date[];
  selectedDateEvents: any[] = [];
  currentEvent: Event | null = null;
  date!: string;
  format = 'yyyy-MM-dd';
  options: ICalendarComponentOptions = {
    pickMode: 'single',
    locale: { locale: 'pl', weekdays: 'short' },
    showToggleButtons: true,
    color: 'primary',
    showAdjacentMonthDay: false,
    showMonthPicker: true,
    showYearPicker: true,
    displayMode: 'month',
    from: new Date(1900, 0, 1),
    to: addYears(new Date(), 1),
  };

  settings = this.appSettings.loadSettings();
  todayDate = new Date().toISOString();

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private modalController: ModalController,
    private appSettings: AppSettingsService,
    private translate: TranslateService
  ) {
    this.setLocale(this.settings.language);
    this.setDayToday();
  }

  ngOnInit(): void {
    this.getEvents();
    this.setValidationMessages();
    this.initializeForm();

    this.translate.onLangChange.subscribe(() => {
      this.setLocale(this.translate.currentLang);
    });
  }

  setValidationMessages() {
    this.translate.get('CALENDAR.ERRORS').subscribe((translations) => {
      this.validationMessages = {
        title: [{ type: 'required', message: translations.TITLE_REQUIRED }],
        endDate: [
          {
            type: 'dateRangeInvalid',
            message: translations.DATE_RANGE_INVALID,
          },
        ],
      };
    });
  }

  initializeForm(): void {
    this.addEvent = this.formBuilder.group(
      {
        title: ['', [Validators.required]],
        startDate: [this.todayDate, [Validators.required]],
        endDate: [this.todayDate, [Validators.required]],
      },
      {
        validators: [dateRangeValidator()],
      }
    );
  }

  setDayToday() {
    this.date = new Date().toISOString().substring(0, 10);
  }

  onChange(event: any) {
    this.date = event;
    const now = new Date();
    const formattedStartDate = this.formatDateTime(this.date, now);

    now.setHours(now.getHours() + 1);
    const formattedEndDate = this.formatDateTime(this.date, now);

    this.addEvent.patchValue({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    this.loadEventsForSelectedDate(this.date);
  }

  private formatDateTime(date: string, time: Date): string {
    return `${date}T${time.getHours().toString().padStart(2, '0')}:${time
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  loadEventsForSelectedDate(date: string) {
    const selectedDate = parseISO(date);

    // Filtrowanie wydarzeń
    this.selectedDateEvents = this.events.filter((event) => {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate);

      return (
        (isEqual(selectedDate, startDate) ||
          isAfter(selectedDate, startDate)) &&
        (isEqual(selectedDate, endDate) || isBefore(selectedDate, endDate))
      );
    });
  }

  setLocale(lang: string) {
    this.options = {
      ...this.options,
      locale: { locale: lang, weekdays: 'short' },
    };
  }

  formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    // Dynamiczne ustawienie języka
    return new Intl.DateTimeFormat(this.settings.language, options).format(
      new Date(date)
    );
  }

  async getEvents() {
    const userId = localStorage.getItem('userId');

    try {
      const response = await axios.get(
        `${this.baseUrl}/event/getEvents/${userId}`
      );
      this.events = response.data;
      this.updateCalendarDays();
      this.loadEventsForSelectedDate(this.date);
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  updateCalendarDays() {
    const daysConfig: IDayConfig[] = [];

    this.events.forEach((event) => {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate);

      const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

      daysInRange.forEach((date) => {
        daysConfig.push({
          date: date,
          subTitle: '●',
        });
      });
    });

    this.options = {
      ...this.options,
      daysConfig,
    };
  }

  async submitForm() {
    this.submitted = true;
    if (this.addEvent.invalid) {
      return;
    }

    const newEvent = this.buildNewEvent();

    try {
      //await this.eventService.addEvent(newEvent);
      this.modalController.dismiss();
      this.events.push(newEvent);
      this.loadEventsForSelectedDate(this.date);
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  buildNewEvent(): Event {
    const userId = localStorage.getItem('userId');
    const startDate = new Date(this.addEvent.get('startDate')?.value);
    const endDate = new Date(this.addEvent.get('endDate')?.value);

    return {
      user_id: userId,
      title: this.addEvent.get('title')?.value,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      startTime: format(startDate, 'HH:mm'),
      endTime: format(endDate, 'HH:mm'),
    };
  }
}
