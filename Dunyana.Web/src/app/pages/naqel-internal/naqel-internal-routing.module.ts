import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NaqelInternalComponent } from './naqel-internal.component';

const routes: Routes = [

  {
    path:"naqel",
    component:NaqelInternalComponent,
    children:[
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class NaqelInternalRoutingModule { }
