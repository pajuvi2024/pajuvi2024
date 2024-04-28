import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Pago2Page } from './pago2.page';

const routes: Routes = [
  {
    path: '',
    component: Pago2Page
  }
];

@NgModule({ 
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Pago2PageRoutingModule {}
