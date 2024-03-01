import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeoRefPage } from './geo-ref.page';

describe('GeoRefPage', () => {
  let component: GeoRefPage;
  let fixture: ComponentFixture<GeoRefPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GeoRefPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
