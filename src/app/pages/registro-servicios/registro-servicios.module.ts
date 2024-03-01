import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroServiciosPageRoutingModule } from './registro-servicios-routing.module';

import { RegistroServiciosPage } from './registro-servicios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroServiciosPageRoutingModule
  ],
  declarations: [RegistroServiciosPage]
})
export class RegistroServiciosPageModule {}
