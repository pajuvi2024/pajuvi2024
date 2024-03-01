import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeocodingPage } from './geocoding.page';

describe('GeocodingPage', () => {
  let component: GeocodingPage;
  let fixture: ComponentFixture<GeocodingPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GeocodingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
