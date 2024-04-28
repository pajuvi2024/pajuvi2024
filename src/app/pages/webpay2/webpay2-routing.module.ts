import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Webpay2Page } from './webpay2.page';

const routes: Routes = [
  {
    path: '',
    component: Webpay2Page 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Webpay2PageRoutingModule {}
