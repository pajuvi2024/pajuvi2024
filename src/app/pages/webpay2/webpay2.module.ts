import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Webpay2PageRoutingModule } from './webpay2-routing.module';

import { Webpay2Page } from './webpay2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Webpay2PageRoutingModule
  ],
  declarations: [Webpay2Page]
})
export class Webpay2PageModule {}
