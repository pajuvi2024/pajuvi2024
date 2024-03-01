import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroServiciosPage } from './registro-servicios.page';

describe('RegistroServiciosPage', () => {
  let component: RegistroServiciosPage;
  let fixture: ComponentFixture<RegistroServiciosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegistroServiciosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
