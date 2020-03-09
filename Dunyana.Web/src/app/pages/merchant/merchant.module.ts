import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RadioButtonModule} from 'primeng/radiobutton';
import {FileUploadModule} from 'primeng/fileupload';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/components/dialog/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import { SharedModule } from 'src/app/shared/shared.module';
import{MerchantRoutingModule}from '../merchant/merchant-routing.module';
import { MerchantHeaderComponent } from './shared/merchant-header/merchant-header.component';
import { MerchantFooterComponent } from './shared/merchant-footer/merchant-footer.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {
  HttpClient,
} from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MerchantHomeComponent } from './merchant-home/merchant-home.component';
import { MerchantEditProfileComponent } from './merchant account management/merchant-edit-profile/merchant-edit-profile.component';
import { LegalRequirementsComponent } from './legal management/legal-requirements/legal-requirements.component';
import { BannerComponent } from './banner management/banner/banner.component';
import { DealsPromotionsComponent } from './deals management/deals-promotions/deals-promotions.component';
import { BillingTermsComponent } from './billing management/billing-terms/billing-terms.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [MerchantHeaderComponent, MerchantFooterComponent,
     MerchantHomeComponent, MerchantEditProfileComponent, LegalRequirementsComponent, BannerComponent, DealsPromotionsComponent, BillingTermsComponent, ],
  exports:[MerchantFooterComponent,MerchantHeaderComponent],

  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DropdownModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    FileUploadModule,
    CalendarModule,
    MerchantRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
})
export class merchantModule { }
