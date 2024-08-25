import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrivingLogPage } from './driving-log.page';

describe('DrivingLogPage', () => {
  let component: DrivingLogPage;
  let fixture: ComponentFixture<DrivingLogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingLogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
