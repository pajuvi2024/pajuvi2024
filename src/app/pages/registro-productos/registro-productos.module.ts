import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroProductosPageRoutingModule } from './registro-productos-routing.module';

import { RegistroProductosPage } from './registro-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroProductosPageRoutingModule
  ],
  declarations: [RegistroProductosPage]
})
export class RegistroProductosPageModule {}
