import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceSummaryPage } from './service-summary.page';

describe('ServiceSummaryPage', () => {
  let component: ServiceSummaryPage;
  let fixture: ComponentFixture<ServiceSummaryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
