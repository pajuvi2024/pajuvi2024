import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UbicationPage } from './ubication.page';

const routes: Routes = [
  {
    path: '',
    component: UbicationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UbicationPageRoutingModule {}
