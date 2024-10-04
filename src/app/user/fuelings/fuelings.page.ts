import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fuelings',
  templateUrl: './fuelings.page.html',
  styleUrls: ['./fuelings.page.scss'],
})
export class FuelingsPage {

  constructor(private router: Router) { }

  segmentChanged(event: any) {
    const selectedSegment = event.detail.value;

    if (selectedSegment === 'list') {
      this.router.navigate(['/fuelings/list']);
    } else if (selectedSegment === 'summary') {
      this.router.navigate(['/fuelings/summary']);
    }
  }
}
