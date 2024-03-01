import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeoRefPageRoutingModule } from './geo-ref-routing.module';

import { GeoRefPage } from './geo-ref.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeoRefPageRoutingModule
  ],
  declarations: [GeoRefPage]
})
export class GeoRefPageModule {}
