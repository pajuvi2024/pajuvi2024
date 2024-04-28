import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Pago2Page } from './pago2.page';

describe('Pago2Page', () => {
  let component: Pago2Page;
  let fixture: ComponentFixture<Pago2Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Pago2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
