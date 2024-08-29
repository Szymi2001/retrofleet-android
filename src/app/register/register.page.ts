import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { backend_Url } from '../app.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  //adres backendu
  private baseUrl = backend_Url;

  registerForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      email: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const repeatPassword = formGroup.get('repeatPassword')?.value;

    if(password !== repeatPassword) {
      formGroup.get('repeatPassword')?.setErrors({passwordMismatch: true});
    } else {
      formGroup.get('repeatPassword')?.setErrors(null);
    }
  } 

  async onSubmit() {
    this.submitted = true;

    // if(this.registerForm.invalid) {
    //   this.messageService.add({severity: 'error', summary: 'Rejestracja', detail: 'Uzupełnij brakujące pola.'});
    // } else {
    //   const login = this.registerForm.get('username')?.value;
    //   const password = this.registerForm.get('password')?.value;
    //   const email = this.registerForm.get('email')?.value;

    //   try {
    //     const response = await axios.post(`${this.baseUrl}/users/register`, {login, password, email});
    //     this.toastService.changeMessage('registered');
    //     this.router.navigate(['/login']);
    //   } catch (error: any) {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Rejestracja nieudana',
    //       detail: error.response?.data?.message || 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.'
    //     });
    //   }
    // }
  }
}
