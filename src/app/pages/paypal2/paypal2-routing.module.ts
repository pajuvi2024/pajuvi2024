import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Paypal2Page } from './paypal2.page';

const routes: Routes = [
  {
    path: '',
    component: Paypal2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Paypal2PageRoutingModule {}
