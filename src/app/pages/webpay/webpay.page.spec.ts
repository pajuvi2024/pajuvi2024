import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebpayPage } from './webpay.page';

describe('WebpayPage', () => {
  let component: WebpayPage;
  let fixture: ComponentFixture<WebpayPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WebpayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
