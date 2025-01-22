import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  //adres backendu
  private baseUrl = environment.backendUrl;
  private subscription!: Subscription;
  
  registerForm!: FormGroup;
  submitted = false;
  validationMessages: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(25),
            Validators.pattern('^[a-zA-Z0-9]+$'),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
            ),
          ],
        ],
        repeatPassword: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      },
      {
        validator: this.matchingPasswords('password', 'repeatPassword'),
      }
    );

    this.setValidationMessages();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  setValidationMessages() {
    // this.translate.get('REGISTER.ERRORS').subscribe((translations) => {
    //   this.validationMessages = {
    //     username: [
    //       { type: 'required', message: translations.USERNAME_REQUIRED },
    //       { type: 'minlength', message: translations.USERNAME_MINLENGTH },
    //       { type: 'maxlength', message: translations.USERNAME_MAXLENGTH },
    //       { type: 'pattern', message: translations.USERNAME_PATTERN },
    //     ],
    //     password: [
    //       { type: 'required', message: translations.PASSWORD_REQUIRED },
    //       { type: 'minlength', message: translations.PASSWORD_MINLENGTH },
    //       { type: 'maxlength', message: translations.PASSWORD_MAXLENGTH },
    //       { type: 'pattern', message: translations.PASSWORD_PATTERN },
    //     ],
    //     repeatPassword: [
    //       { type: 'required', message: translations.REPEAT_PASSWORD_REQUIRED },
    //       { type: 'matching', message: translations.PASSWORD_MISMATCH },
    //     ],
    //     email: [
    //       { type: 'required', message: translations.EMAIL_REQUIRED },
    //       { type: 'email', message: translations.EMAIL_INVALID },
    //     ],
    //   };
    // });
  }

  matchingPasswords(password: string, repeatPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.get(password);
      const repeatPasswordControl = formGroup.get(repeatPassword);

      if (
        repeatPasswordControl?.errors &&
        !repeatPasswordControl?.errors['matching']
      ) {
        return;
      }

      if (passwordControl?.value !== repeatPasswordControl?.value) {
        repeatPasswordControl?.setErrors({ matching: true });
      } else {
        repeatPasswordControl?.setErrors(null);
      }
    };
  }

  async onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const login = this.registerForm.get('username')?.value;
    const password = this.registerForm.get('password')?.value;
    const email = this.registerForm.get('email')?.value;

    try {
      const response = await axios.post(`${this.baseUrl}/users/register`, {
        login,
        password,
        email,
      });
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }
}
