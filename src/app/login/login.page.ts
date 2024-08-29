import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import axios from 'axios';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth.service';
import { backend_Url } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //adres backendu
  private baseUrl = backend_Url;
  private subscription!: Subscription;

  loginForm!: FormGroup;
  submitted = false;

  isLoggedInSubject: any;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
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

    //TODO: Haszowanie hasła
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
