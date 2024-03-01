import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UbicationPage } from './ubication.page';

describe('UbicationPage', () => {
  let component: UbicationPage;
  let fixture: ComponentFixture<UbicationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UbicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
