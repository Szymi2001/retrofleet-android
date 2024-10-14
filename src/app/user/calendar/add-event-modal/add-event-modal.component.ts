import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { format, isAfter, isEqual, parseISO, setDay } from 'date-fns';
import { dateRangeValidator } from 'src/app/shared/validators/formValidators';
import { AppSettingsService } from 'src/services/appSettings.service';

@Component({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.component.html',
  styleUrls: ['./add-event-modal.component.scss'],
})

//TODO: Pobierz locale i przypisz do ion-datetime
export class AddEventModalComponent implements OnInit {
  @Input() selectedDate!: string;
  
  eventForm!: FormGroup;
  submitted: boolean = false;
  validationMessages: any = [];

  date!: string;
  todayDate = new Date();

  settings = this.appSettings.loadSettings();

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private appSettings: AppSettingsService
  ) {
    this.setDayToday();
  }

  ngOnInit() {
    this.initializeForm();
    this.setValidationMessages();
  }

  setDayToday() {
    this.date = new Date().toISOString().substring(0, 10);
  } 

  initializeForm(): void {
    this.eventForm = this.formBuilder.group(
      {
        title: ['', [Validators.required]],
        startDate: [this.formatDateTime(this.selectedDate, this.todayDate, 0), [Validators.required]],
        endDate: [this.formatDateTime(this.selectedDate, this.todayDate, 1), [Validators.required]],
      },
      {
        validators: [dateRangeValidator()],
      }
    );
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

  private formatDateTime(date: string, time: Date, hourOffset: number = 0): string {
    const newTime = new Date(time);
    newTime.setHours(time.getHours() + hourOffset);

    return `${date}T${newTime.getHours().toString().padStart(2, '0')}:${newTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  dismiss(): void {
    this.modalController.dismiss();
  }

  //Wyślij formularz
  submitForm(): void {
    this.submitted = true;

    this.eventForm.markAllAsTouched();

    if (this.eventForm.valid) {
      this.modalController.dismiss(this.eventForm.value);
    }
  }
}
