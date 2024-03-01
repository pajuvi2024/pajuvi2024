import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeocodingPageRoutingModule } from './geocoding-routing.module';

import { GeocodingPage } from './geocoding.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeocodingPageRoutingModule
  ],
  declarations: [GeocodingPage]
})
export class GeocodingPageModule {}
