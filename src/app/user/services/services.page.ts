import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {
  currentSegment: string = '';

  constructor(private router: Router, private storageService: StorageService) {}

  async ngOnInit() {
    const savedSegment = await this.storageService.get('currentServicesSegment');
    this.currentSegment = savedSegment || 'list';

    this.router.navigate([`/services/${this.currentSegment}`]);
  }

  async segmentChanged(event: any) {
    const selectedSegment = event.detail.value;

    await this.storageService.set('currentServicesSegment', selectedSegment);

    this.router.navigate([`/services/${selectedSegment}`]);
  }
}
