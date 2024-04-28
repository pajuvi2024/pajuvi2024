import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Paypal2Page } from './paypal2.page';

describe('Paypal2Page', () => {
  let component: Paypal2Page;
  let fixture: ComponentFixture<Paypal2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Paypal2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
