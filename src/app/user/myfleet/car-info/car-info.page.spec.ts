import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarInfoPage } from './car-info.page';

describe('CarInfoPage', () => {
  let component: CarInfoPage;
  let fixture: ComponentFixture<CarInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
