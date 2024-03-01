import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MembresiaPage } from './membresia.page';

describe('MembresiaPage', () => {
  let component: MembresiaPage;
  let fixture: ComponentFixture<MembresiaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MembresiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
