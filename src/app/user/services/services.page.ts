import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage {

  constructor(private router: Router) { }

  segmentChanged(event: any) {
    const selectedSegment = event.detail.value;

    if (selectedSegment === 'list') {
      this.router.navigate(['/services/list']);
    } else if (selectedSegment === 'summary') {
      this.router.navigate(['/services/summary']);
    }
  }

}
