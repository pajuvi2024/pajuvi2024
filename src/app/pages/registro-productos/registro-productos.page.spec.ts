import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroProductosPage } from './registro-productos.page';

describe('RegistroProductosPage', () => {
  let component: RegistroProductosPage;
  let fixture: ComponentFixture<RegistroProductosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RegistroProductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
