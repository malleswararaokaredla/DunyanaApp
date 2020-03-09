import { Component, OnInit } from '@angular/core';
import { CheckoutResponse } from '../CheckoutResponse';
import { PaymentModel } from '../../../model/DTOs/PaymentModel';
import { LocalStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-payment-exception',
  templateUrl: './payment-exception.component.html',
  styleUrls: ['./payment-exception.component.scss']
})
export class PaymentExceptionComponent implements OnInit {
  checkinfo: string = 'assets/layout/images/svg/failed.svg';
  paymentResponse: any;
  public paymentModel: PaymentModel;
  isFromOrder: boolean;
  returnURL: string;
  constructor(private checkoutResponse: CheckoutResponse, private localStorage: LocalStorageService) { }

  ngOnInit() {
    this.isFromOrder = false;
    this.paymentResponse = this.checkoutResponse.storage;
    this.paymentModel = this.checkoutResponse.paymentModel;
    if (this.paymentModel != null) {
      this.isFromOrder = this.paymentModel.isFromOrder;
      this.returnURL = this.localStorage.get('returnUrl');
    }
  }

}
