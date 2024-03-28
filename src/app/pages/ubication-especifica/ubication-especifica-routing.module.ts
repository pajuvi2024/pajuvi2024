import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UbicationEspecificaPage } from './ubication-especifica.page';

const routes: Routes = [
  {
    path: '',
    component: UbicationEspecificaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UbicationEspecificaPageRoutingModule {}
