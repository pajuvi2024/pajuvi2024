import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebpayPageRoutingModule } from './webpay-routing.module';

import { WebpayPage } from './webpay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebpayPageRoutingModule
  ],
  declarations: [WebpayPage]
})
export class WebpayPageModule {}
