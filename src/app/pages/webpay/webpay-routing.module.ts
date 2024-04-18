import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebpayPage } from './webpay.page';

const routes: Routes = [
  {
    path: '',
    component: WebpayPage 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebpayPageRoutingModule {}
