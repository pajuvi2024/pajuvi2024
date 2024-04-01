import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UbicationEspecificaPage } from './ubication-especifica.page';

describe('UbicationEspecificaPage', () => {
  let component: UbicationEspecificaPage;
  let fixture: ComponentFixture<UbicationEspecificaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UbicationEspecificaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
