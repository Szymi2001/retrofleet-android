import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFuelingPage } from './add-fueling.page';

describe('AddFuelingPage', () => {
  let component: AddFuelingPage;
  let fixture: ComponentFixture<AddFuelingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFuelingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
