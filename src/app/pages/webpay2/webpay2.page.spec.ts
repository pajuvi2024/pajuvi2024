import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Webpay2Page } from './webpay2.page';

describe('Webpay2Page', () => {
  let component: Webpay2Page;
  let fixture: ComponentFixture<Webpay2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Webpay2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
