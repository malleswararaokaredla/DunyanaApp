import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { CategoryListComponent } from './category management/category-list/category-list.component';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TableModule} from 'primeng/table';
import { AddCategoriesComponent } from './category management/add-categories/add-categories.component';
import {DialogModule} from 'primeng/components/dialog/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersListComponent } from './Usermanagement/users-list/users-list.component';
import { AddUsersComponent } from './Usermanagement/add-users/add-users.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminMenuComponent } from './shared/admin-menu/admin-menu.component';
import { AdminHeaderComponent } from './shared/admin-header/admin-header.component';
import { AdminFooterComponent } from './shared/admin-footer/admin-footer.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NaqelContractTeamComponent } from './naqel internal team/naqel-contract-team/naqel-contract-team.component';
import { NaqelFinanceTeamComponent } from './naqel internal team/naqel-finance-team/naqel-finance-team.component';
import { NaqelLegalTeamComponent } from './naqel internal team/naqel-legal-team/naqel-legal-team.component';
import { MerchantcaptureParametersComponent } from './merchant management/merchantcapture-parameters/merchantcapture-parameters.component';
import { AddMerchantParamComponent } from './merchant management/add-merchant-param/add-merchant-param.component';
import { AdminEditProfileComponent } from './admin account management/admin-edit-profile/admin-edit-profile.component'
import { AuthGuard } from 'src/app/shared/auth//_guards';
import { CatalogListComponent } from './merchant catalog management/catalog-list/catalog-list.component';
import { PromotionsListComponent } from './promotions management/promotions-list/promotions-list.component';
import { AddMerchantCatalogComponent } from './merchant catalog management/add-merchant-catalog/add-merchant-catalog.component';
import { MerchantCreditListComponent } from './merchant-wise credits/merchant-credit-list/merchant-credit-list.component';
import { OrdersComponent } from './orders/orders.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}



@NgModule({
  declarations: [CategoryListComponent, AddCategoriesComponent, UsersListComponent, AddUsersComponent, AdminHomeComponent,AdminFooterComponent, AdminMenuComponent,
    MerchantcaptureParametersComponent, 
  NaqelContractTeamComponent,NaqelFinanceTeamComponent,NaqelLegalTeamComponent,AdminHeaderComponent, AddMerchantParamComponent, AdminEditProfileComponent, CatalogListComponent, PromotionsListComponent, AddMerchantCatalogComponent, MerchantCreditListComponent, OrdersComponent],
  exports:[AdminMenuComponent,AdminFooterComponent,AdminHeaderComponent],

  imports: [
    CommonModule,
    TableModule,
    AdminRoutingModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DropdownModule,
    ProgressSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [AuthGuard ]
})
export class AdminModule { }
