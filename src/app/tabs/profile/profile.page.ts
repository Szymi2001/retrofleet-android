import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from 'src/services/endpoints/profileEndpoint.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { ImageService } from 'src/services/endpoints/imageEndpoint.service';
import { UserInfo } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userId: string | null = null;

  profileImage: any[] = [];

  //Sekcja informacje
  changeUserInfo!: FormGroup;
  changePassword!: FormGroup;

  isChangeDataModalOpen = false;
  isChangePasswordModalOpen = false;

  submittedUserInfo = false;
  submittedNewPassword = false;
  
  userInfo: UserInfo = {
    login: '',
    password: '',
    email: '',
    name: '',
    surname: '',
    first_question: '',
    first_answer: '',
    second_question: '',
    second_answer: '',
  };

  //Sekcja prywatność
  deleteAccount!: FormGroup;

  //Sekcja bezpieczeństwo
  remindQuestions!: FormGroup;
  firstQuestions: Array<{ label: string }> = [];
  secondQuestions: Array<{ label: string }> = [];

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.initializeForms();
    this.initializeQuestions();
    this.loadUserInfo();

    this.profileService.userInfo$.subscribe(data => {
        this.userInfo = data;
      });

    await this.presentLoading();
    this.loadingController.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Ładowanie modułu...',
      spinner: 'circles'
    });
    await loading.present();
    return loading;
  }

  initializeForms(): void {
    this.changeUserInfo = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      surname: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    });

    this.changePassword = this.formBuilder.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      repeat_password: ['', Validators.required],
    });

    this.deleteAccount = this.formBuilder.group({
      password: ['', Validators.required],
    });

    this.remindQuestions = this.formBuilder.group({
      first_question: ['', Validators.required],
      first_answer: ['', Validators.required],
      second_question: ['', Validators.required],
      second_answer: ['', Validators.required],
    });
  }

  initializeQuestions(): void {
    this.firstQuestions = [
      { label: 'Jakie jest imię Twojego pierwszego zwierzaka?' },
      { label: 'Jakie jest panieńskie nazwisko Twojej matki?' },
      {
        label: 'Jakie jest imię Twojego najlepszego przyjaciela z dzieciństwa?',
      },
      { label: 'Jaki jest kolor Twojego pierwszego samochodu?' },
      { label: 'Jakie jest Twoje ulubione miejsce wakacyjne?' },
      { label: 'Jak nazywa się Twoja pierwsza szkoła?' },
      { label: 'Jakie jest Twoje ulubione danie?' },
      { label: 'Jaki jest twój numer ulubiony?' },
    ];
    this.secondQuestions = [...this.firstQuestions];
  }

  //Modals
  setOpenChangeDataModal(isOpen: boolean) {
    this.changeUserInfo.reset();
    this.isChangeDataModalOpen = isOpen;
  }

  setOpenChangePasswordModal(isOpen: boolean) {
    this.changePassword.reset();
    this.isChangePasswordModalOpen = isOpen;
  }

  async onChangeDataModalDismiss(event: any) {
    const data = event.detail.data;
    if (data) {
      console.log('Change Data Modal Data:', data);
    }
  }

  async onChangePasswordModalDismiss(event: any) {
    const data = event.detail.data;
    if (data) {
      console.log('Change Password Modal Data:', data);
    }
  }

  private async loadUserInfo(): Promise<void> {
    try {
      this.userId = await this.authService.getUserIdFromStorage();
      if (this.userId) {
        this.userInfo = await this.profileService.getUserInfo(this.userId);
      }
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  async changeUserInfoOnSubmit(): Promise<void> {
    this.submittedUserInfo = true;

    if (this.changeUserInfo.invalid) return;

    const { name, surname } = this.changeUserInfo.value;
    await this.updateUserInfo(name, surname);
    this.loadUserInfo();
    this.setOpenChangeDataModal(false);
  }

  async updateUserInfo(name: string, surname: string) {
    if (!this.userId) return;

    try {
      await this.profileService.updateUserInfo(this.userId, name, surname);
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  async changePasswordOnSubmit() {
    this.submittedNewPassword = true;

    if (this.changePassword.invalid) return;

    const { old_password, new_password, repeat_password } =
      this.changePassword.value;
    if (new_password !== repeat_password) {
      return;
    }

    try {
      await this.profileService.updatePassword(
        this.userId,
        old_password,
        new_password
      );
      this.setOpenChangePasswordModal(false);
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  async getUserInfo(userId: any) {
    try {
      this.userInfo = await this.profileService.getUserInfo(userId);
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  onRemindQuestionsSubmit(): void {

  }

  onDeleteAccountSubmit(): void {

  }

  async logout() {
    this.authService.logout();
  }
}
