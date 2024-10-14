import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import axios from 'axios';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

//TODO: Przypomnienie hasła za pomocą loginu
export class LoginPage implements OnInit, OnDestroy {
  //Backend address
  private baseUrl = environment.backendUrl;
  private subscription!: Subscription;

  loginForm!: FormGroup;
  validationMessages: any = [];

  isLoggedInSubject: any;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    this.loginForm = this.formBuilder.group({
      login: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });

    //Init Ionic Storage
    await this.storageService.init();

    this.setValidationMessages();

    this.subscription = this.translate.onLangChange.subscribe(() => {
      this.setValidationMessages();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setValidationMessages() {
    this.translate.get('LOGIN.ERRORS').subscribe((translations) => {
      this.validationMessages = {
        login: [
          { type: 'required', message: translations.USERNAME_REQUIRED },
          { type: 'minlength', message: translations.USERNAME_MINLENGTH },
          { type: 'maxlength', message: translations.USERNAME_MAXLENGTH },
        ],
        password: [
          { type: 'required', message: translations.PASSWORD_REQUIRED },
          { type: 'minlength', message: translations.PASSWORD_MINLENGTH },
        ],
      };
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const login = this.loginForm.get('login')?.value;
    const password = this.loginForm.get('password')?.value;

    //TODO: Haszowanie hasła
    try {
      const response = await axios.post(`${this.baseUrl}/users/login`, {
        login,
        password,
      });
      const { id } = response.data;

      //UserId to Ionic Storage
      await this.storageService.set('userId', id);
      this.authService.setLoggedIn(true, id);

      //Form reset
      this.loginForm.reset();

      //Validators reset
      this.loginForm.setErrors(null);

      //Navigate to myfleet
      this.router.navigateByUrl('myfleet');
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }
}
