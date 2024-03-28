import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UbicationEspecificaPageRoutingModule } from './ubication-especifica-routing.module';

import { UbicationEspecificaPage } from './ubication-especifica.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UbicationEspecificaPageRoutingModule
  ],
  declarations: [UbicationEspecificaPage]
})
export class UbicationEspecificaPageModule {}
