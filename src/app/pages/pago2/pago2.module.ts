import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Pago2PageRoutingModule } from './pago2-routing.module';

import { Pago2Page } from './pago2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Pago2PageRoutingModule
  ],
  declarations: [Pago2Page]
})
export class Pago2PageModule {}
