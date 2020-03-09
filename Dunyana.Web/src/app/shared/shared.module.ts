import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/components/button/button';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/components/dialog/dialog';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputTextModule} from 'primeng/inputtext';
import { ImageCropperModule } from 'ngx-image-cropper';
import {CarouselModule} from 'primeng/carousel';
import {PaginatorModule} from 'primeng/paginator';
import {MultiSelectModule} from 'primeng/multiselect';
import {RadioButtonModule} from 'primeng/radiobutton';
import {TabViewModule} from 'primeng/tabview';
import {TabMenuModule} from 'primeng/tabmenu';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {CheckboxModule} from 'primeng/checkbox';
import { ChangepasswordComponent } from '../pages/customer/user management/changepassword/changepassword.component';
import { EditProfileComponent } from '../pages/customer/customerapp/account management/edit-profile/edit-profile.component';
import { BlockCopyPasteDirective } from './directives/BlockCopyPasteDirective';
import { MerchantUrlNotFoundComponent } from '../merchant-url-not-found/merchant-url-not-found.component';

const COMMON_MODULES = [

  ButtonModule,
  DropdownModule,
  DialogModule,
  ToastModule,
  ProgressSpinnerModule,
  TableModule,
  InputTextModule,
  ImageCropperModule,
  CarouselModule,
  PaginatorModule,
  MultiSelectModule,
  RadioButtonModule,
  TabViewModule,
  TabMenuModule,
  CalendarModule,
  ConfirmDialogModule,
  CheckboxModule,

]

@NgModule({
  declarations: [ChangepasswordComponent,EditProfileComponent,MerchantUrlNotFoundComponent, BlockCopyPasteDirective],
  imports: [
    CommonModule,
    COMMON_MODULES,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [COMMON_MODULES,ChangepasswordComponent,EditProfileComponent,MerchantUrlNotFoundComponent, BlockCopyPasteDirective]
})
export class SharedModule { }
