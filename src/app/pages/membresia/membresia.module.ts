import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MembresiaPageRoutingModule } from './membresia-routing.module';

import { MembresiaPage } from './membresia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MembresiaPageRoutingModule
  ],
  declarations: [MembresiaPage]
})
export class MembresiaPageModule {}
