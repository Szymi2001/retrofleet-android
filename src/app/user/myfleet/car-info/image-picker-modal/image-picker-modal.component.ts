import { Component, Input, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LoadingController, ModalController } from '@ionic/angular';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { ImageService } from 'src/services/endpoints/imageEndpoint.service';
import { ImageUpdateService } from 'src/services/imageUpdate.service';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker-modal.component.html',
  styleUrls: ['./image-picker-modal.component.scss'],
})
//TODO: Usunięcia zdjęcia w celu zastosowania domyślnego
export class ImagePickerComponent {
  private userId = localStorage.getItem('userId');

  @ViewChild('cropper') cropper!: ImageCropperComponent;

  @Input() carId: any;
  croppedImage: any = '';
  croppedBlob: any = '';
  myImage: any = null;

  constructor(private modalController: ModalController,
    private imageService: ImageService,
    private imageUpdateService: ImageUpdateService,
    private sanitizer: DomSanitizer,
    private loadingCtrl: LoadingController
  ) {}

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.myImage = `data:image/${image.format};base64,${image.base64String}`;
    this.croppedImage = null;
  }

  cancelCropping() {
    this.myImage = null;
  }

  imageLoaded() {
    this.loadingCtrl.dismiss();
  }
  
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl || event.base64 || '');
    this.croppedBlob = event.blob;
  }

  async uploadCropperImage() {

    const formData = new FormData();
    formData.append('image', this.croppedBlob, `${this.userId}.png`);

    try {
      await this.imageService.uploadImage(this.userId!, this.carId, formData);
      this.imageUpdateService.notifyPhotoUpdate();
      this.modalController.dismiss({ imageAdded: true });
    } catch (error: any) {
      console.error('Błąd:', error.response?.data || error.message);
    }
  }

  async removeImage() {

  }

  dismiss():void {
    this.modalController.dismiss();
  }

}
