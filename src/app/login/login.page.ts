import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
<<<<<<< HEAD
import { TranslateService } from '@ngx-translate/core';
=======
>>>>>>> 2108c01 (module settings, more translations)
import axios from 'axios';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //adres backendu
  private baseUrl = 'http://192.168.0.154:3000';
  private subscription!: Subscription;

  loginForm!: FormGroup;
  submitted = false;

  isLoggedInSubject: any;

  constructor(
    private formBuilder: FormBuilder,
<<<<<<< HEAD
    private translate: TranslateService,
=======
>>>>>>> 2108c01 (module settings, more translations)
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const login = this.loginForm.get('login')?.value;
    const password = this.loginForm.get('password')?.value;

<<<<<<< HEAD
=======

    //TODO: Haszowanie hasła
>>>>>>> 2108c01 (module settings, more translations)
    try {
      const response = await axios.post(`${this.baseUrl}/users/login`, {
        login,
        password,
      });
      const { id } = response.data;

      //Id użytkownika do localStorage
      localStorage.setItem('userId', id);
      this.authService.setLoggedIn(true);
      this.router.navigateByUrl('myfleet');
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }
}
