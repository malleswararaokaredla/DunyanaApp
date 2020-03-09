import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantComponent } from './merchant.component';
import{MerchantregistrationComponent}from './merchant management/merchantregistration/merchantregistration.component';
import { HomeComponent } from '../customer/customerapp/home/home.component';
import { MerchantHomeComponent } from './merchant-home/merchant-home.component';
import { ShoppingComponent } from '../customer/customerapp/shopping/shopping.component';
import { AuthGuard } from 'src/app/shared/auth//_guards';


const routes: Routes = [
  {
    path:"merchant",
    component:MerchantComponent,
    children:[
      {
        path:"home",
        component:HomeComponent
      },
      {
        path:"shopping/:catid",
        component:ShoppingComponent
      },
      {
        path:"profile",
        component:MerchantHomeComponent,
        canActivate: [AuthGuard],  
        runGuardsAndResolvers: 'always'
      }
    ]
  },
  {
    path:"merchants/registration",
    component:MerchantregistrationComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class MerchantRoutingModule {

 }
