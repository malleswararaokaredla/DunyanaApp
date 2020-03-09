import { Component, OnInit } from '@angular/core';
import { CheckoutResponse } from '../CheckoutResponse';
import { PaymentModel } from '../../../model/DTOs/PaymentModel';
import { LocalStorageService } from 'angular-web-storage';
@Component({
  selector: 'app-paymentfailure',
  templateUrl: './paymentfailure.component.html',
  styleUrls: ['./paymentfailure.component.scss']
})
export class PaymentfailureComponent implements OnInit {

  checkinfo: string = 'assets/layout/images/svg/failed.svg';
  paymentResponse: any;
  isNewCard: boolean;
  public paymentModel:  PaymentModel;
  isFromOrder: boolean;
  returnURL: string;
  constructor(private checkoutResponse: CheckoutResponse, private localStorage: LocalStorageService) { }

  ngOnInit() {
    this.isFromOrder = false;
    this.paymentResponse = this.checkoutResponse.storage;
    this.paymentModel = this.checkoutResponse.paymentModel;
    this.isNewCard = this.checkoutResponse.isNewCard;
    if (this.paymentModel != null) {
      this.isFromOrder = this.paymentModel.isFromOrder;
      this.returnURL = this.localStorage.get('returnUrl');
    }
  }

}
