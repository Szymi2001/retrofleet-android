import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { CalendarComponent, CalendarMode } from 'ionic8-calendar';

interface Event {
  user_id: string | null;
  title: string;
  allDay: boolean;
  startTime: Date;
  endTime: Date;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage {
  //Adres backendu
  private baseUrl = 'http://192.168.0.154:3000';
  @ViewChild(CalendarComponent) myCalendar!: CalendarComponent;

  submitted = false;
  addEvent!: FormGroup;
  todayDate = new Date().toISOString();
  eventSource: Array<any> = [];

  viewTitle = '';
  calendar = {
    eventSource: this.eventSource,
    mode: 'month' as CalendarMode,
    currentDate: new Date(),
    locale: 'pl',
    dateFormatter: {
      formatMonthViewDayHeader: function (date: Date) {
        const weeks = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'];
        return weeks[date.getDay()];
      },
      formatMonthViewTitle: function (date: Date) {
        const months = [
          'Styczeń',
          'Luty',
          'Marzec',
          'Kwiecień',
          'Maj',
          'Czerwiec',
          'Lipiec',
          'Sierpień',
          'Wrzesień',
          'Październik',
          'Listopad',
          'Grudzień',
        ];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
      },
    },
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
<<<<<<< HEAD
    //this.getEvents();
=======
    this.getEvents();
>>>>>>> 2108c01 (module settings, more translations)
    this.initializeForm();
  }

  initializeForm(): void {
    this.addEvent = this.formBuilder.group({
      title: ['', Validators.required],
      allDay: [false],
      startTime: [this.todayDate, [Validators.required]],
      endTime: [this.todayDate, Validators.required],
    });
  }

  setToday(): void {
    this.myCalendar.currentDate = new Date();
  }

  calendarBack(): void {
    this.myCalendar.slidePrev();
  }

  calendarForward(): void {
    this.myCalendar.slideNext();
  }

  async getEvents() {
    const userId = localStorage.getItem('userId');

    try {
      const response = await axios.get(
        `${this.baseUrl}/event/getEvents/${userId}`
      );
      this.eventSource = response.data;
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }
<<<<<<< HEAD

=======
>>>>>>> 2108c01 (module settings, more translations)
  converToUTC(date: Date): Date {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.addEvent.invalid) {
      return;
    }

    const newEvent = this.buildNewEvent();
    
    this.eventSource.push(newEvent);
    this.myCalendar.eventSource = [...this.eventSource];
<<<<<<< HEAD
    console.log(this.eventSource);
=======
    //TODO: Dodać wysyłanie na serwer
>>>>>>> 2108c01 (module settings, more translations)
  }

  buildNewEvent(): Event {
    const userId = localStorage.getItem('userId');
    const startTime = this.addEvent.get('startTime')?.value;
    const endTime = this.addEvent.get('endTime')?.value;

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    return {
      user_id: userId,
      title: this.addEvent.get('title')?.value,
      allDay: this.addEvent.get('allDay')?.value,
      startTime: this.converToUTC(startDate),
      endTime: this.converToUTC(endDate),
    };
  }
}
