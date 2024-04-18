import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaypalPage } from './paypal.page';

describe('PaypalPage', () => {
  let component: PaypalPage;
  let fixture: ComponentFixture<PaypalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaypalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
