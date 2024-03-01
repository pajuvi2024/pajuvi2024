import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UbicationPageRoutingModule } from './ubication-routing.module';

import { UbicationPage } from './ubication.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UbicationPageRoutingModule,
    SharedModule
  ],
  declarations: [UbicationPage]
})
export class UbicationPageModule {}
