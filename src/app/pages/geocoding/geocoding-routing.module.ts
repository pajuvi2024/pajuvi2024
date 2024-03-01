import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeocodingPage } from './geocoding.page';

const routes: Routes = [
  {
    path: '',
    component: GeocodingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeocodingPageRoutingModule {}
