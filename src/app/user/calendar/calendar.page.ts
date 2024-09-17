import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { CalendarComponent, CalendarMode } from 'ionic8-calendar';
import { backend_Url } from 'src/app/app.component';
import { eachDayOfInterval, endOfDay, endOfMonth, format, isSameDay as isSameDayFns, parseISO, startOfDay, startOfMonth } from 'date-fns';
import { ModalController } from '@ionic/angular';
import { CalendarEvent } from 'calendar-utils';

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

//TODO: Zmiana języka
export class CalendarPage {
  //Adres backendu
  private baseUrl = backend_Url;
  @ViewChild(CalendarComponent) myCalendar!: CalendarComponent;

  submitted = false;
  eventSource: Array<any> = [];
  addEvent!: FormGroup;
  todayDate = new Date().toISOString();
  showStart = false;
  showEnd = false;
  formattedStart = '';
  formattedEnd = '';
  
  viewTitle = '';
  calendar = {
    eventSource: this.eventSource,
    mode: 'month' as CalendarMode,
    currentDate: new Date(),
    locale: 'pl',
    dateFormatter: {
    //   formatMonthViewDayHeader: function (date: Date) {
    //     const weeks = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'];
    //     return weeks[date.getDay()];
    //   },
    //   formatMonthViewTitle: function (date: Date) {
    //     const months = [
    //       'Styczeń',
    //       'Luty',
    //       'Marzec',
    //       'Kwiecień',
    //       'Maj',
    //       'Czerwiec',
    //       'Lipiec',
    //       'Sierpień',
    //       'Wrzesień',
    //       'Październik',
    //       'Listopad',
    //       'Grudzień',
    //     ];
    //     return `${months[date.getMonth()]} ${date.getFullYear()}`;
    //   },
     },
  };

  constructor(
    private formBuilder: FormBuilder, private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.getEvents();
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

  onTimeSelected(event: { selectedTime: Date; events: any[]}) {
    const baseTime = new Date(event.selectedTime);

    const startTime = new Date(baseTime);
    startTime.setHours(8,0,0,0);

    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + 30);

    this.formattedStart = format(startTime, 'HH:mm, MMM d, yyyy');
    this.formattedEnd = format(endTime, 'HH:mm, MMM d, yyyy');

    this.addEvent.patchValue({
      startTime: format(startTime, "yyyy-MM-dd'T'HH:mm:ss"),
      endTime: format(endTime, "yyyy-MM-dd'T'HH:mm:ss")
    });
  }

  onEventSelected(event: any) {
    console.log(event)
  }
  
  startChanged(value: any) {
    this.addEvent.patchValue({
      startTime: value
    });
    this.formattedStart = format(parseISO(value), 'HH:mm, MMM d, yyyy');
  }

  endChanged(value: any) {
    this.addEvent.patchValue({
      endTime: value
    });
    this.formattedEnd = format(parseISO(value), 'HH:mm, MMM d, yyyy');
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

  async submitForm() {
    this.submitted = true;

    const newEvent = this.buildNewEvent();

    console.log(newEvent)
    this.modalController.dismiss();
    this.addEvent.reset();
    this.eventSource.push(newEvent);
    this.myCalendar.eventSource = [...this.eventSource];

    //TODO: Dodać wysyłanie na serwer
  }

  buildNewEvent(): Event {
    const userId = localStorage.getItem('userId');
    

    return {
      user_id: userId,
      title: this.addEvent.get('title')?.value,
      allDay: this.addEvent.get('allDay')?.value,
      startTime: new Date(this.addEvent.get('startTime')?.value),
      endTime: new Date(this.addEvent.get('endTime')?.value),
    };
  }
}
