import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Paypal2PageRoutingModule } from './paypal2-routing.module';

import { Paypal2Page } from './paypal2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Paypal2PageRoutingModule
  ],
  declarations: [Paypal2Page]
})
export class Paypal2PageModule {}
