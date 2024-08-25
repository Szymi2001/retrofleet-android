import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuelingSummaryPage } from './fueling-summary.page';

describe('FuelingSummaryPage', () => {
  let component: FuelingSummaryPage;
  let fixture: ComponentFixture<FuelingSummaryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelingSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
