import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-fuelings',
  templateUrl: './fuelings.page.html',
  styleUrls: ['./fuelings.page.scss'],
})
export class FuelingsPage {
  currentSegment: string = '';

  constructor(private router: Router, private storageService: StorageService) {}

  async ngOnInit() {
    const savedSegment = await this.storageService.get('currentFuelingsSegment');
    this.currentSegment = savedSegment || 'list';

    this.router.navigate([`/fuelings/${this.currentSegment}`]);
  }

  async segmentChanged(event: any) {
    const selectedSegment = event.detail.value;

    await this.storageService.set('currentFuelingsSegment', selectedSegment);

    this.router.navigate([`/fuelings/${selectedSegment}`]);
  }
}
