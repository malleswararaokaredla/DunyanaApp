import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryListComponent } from './category management/category-list/category-list.component';
import { AdminComponent } from './admin.component';
import { UsersListComponent } from './Usermanagement/users-list/users-list.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

import { HomeComponent } from '../customer/customerapp/home/home.component';
import { NaqelFinanceTeamComponent } from './naqel internal team/naqel-finance-team/naqel-finance-team.component';
import { NaqelContractTeamComponent } from './naqel internal team/naqel-contract-team/naqel-contract-team.component';
import { NaqelLegalTeamComponent } from './naqel internal team/naqel-legal-team/naqel-legal-team.component';
import { MerchantcaptureParametersComponent } from './merchant management/merchantcapture-parameters/merchantcapture-parameters.component'
import { AuthGuard } from 'src/app/shared/auth//_guards';
import { CatalogListComponent } from './merchant catalog management/catalog-list/catalog-list.component';
import { PromotionsListComponent } from './promotions management/promotions-list/promotions-list.component';
import { MerchantCreditListComponent } from './merchant-wise credits/merchant-credit-list/merchant-credit-list.component';
import { OrdersComponent } from './orders/orders.component';


const routes: Routes = [
  {
    path: "admin",
    component: AdminComponent,
    children: [
      {
        path: "home",
        component: HomeComponent,
      },
      {
        path: "profile",
        component: AdminHomeComponent,
        canActivate: [AuthGuard],  
        runGuardsAndResolvers: 'always'
      },
      {
        path: "naqel-admin/profile",
        component: AdminHomeComponent,
        canActivate: [AuthGuard],  
        runGuardsAndResolvers: 'always'
      },
      {
        path: "categorylist",
        component: CategoryListComponent,
        canActivate: [AuthGuard],  
        runGuardsAndResolvers: 'always'
      },
      {
        path: "userslist",
        component: UsersListComponent,
        canActivate: [AuthGuard],  
        runGuardsAndResolvers: 'always'
      },
      {

        path: "naqel-finance-team",
        component: NaqelFinanceTeamComponent,
        canActivate: [AuthGuard],  
        runGuardsAndResolvers: 'always'
      },

      {
        path: "naqel-legal-team",
        component: NaqelLegalTeamComponent,
        canActivate: [AuthGuard],  
        runGuardsAndResolvers: 'always'
      },

      {
        path: "naqel-contract-team",
        component: NaqelContractTeamComponent,
        canActivate: [AuthGuard],  
        runGuardsAndResolvers: 'always'
      },
      {
        path: "merchentcaptureparameters",
        component: MerchantcaptureParametersComponent,
        canActivate: [AuthGuard],  
        runGuardsAndResolvers: 'always'
      },
      {
        path: "merchent-catalog",
        component:CatalogListComponent,
        canActivate: [AuthGuard],  
        runGuardsAndResolvers: 'always'
      },
      {
        path: "promotions",
        component:PromotionsListComponent,
        canActivate: [AuthGuard],  
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'merchantCredits',
        component: MerchantCreditListComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      },

      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always'
      }

    ]
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {

}
