import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutResponse } from '../CheckoutResponse';
import { WalletmanagementService } from '../../../services/walletmanagement.service';
import { PaymentModel } from '../../../model/DTOs/PaymentModel';
import { WalletDto } from '../../../model/DTOs/WalletDto';
import { LocalStorageService } from 'angular-web-storage';
import { OrdermanagementService } from '../../../services/ordermanagemet.service';
@Component({
  selector: 'app-paymentsuccess',
  templateUrl: './paymentsuccess.component.html',
  styleUrls: ['./paymentsuccess.component.scss']
})
export class PaymentsuccessComponent implements OnInit {
  checkinfo: string = 'assets/layout/images/svg/success.svg';
  paymentResponse: any;
  paymentModel: PaymentModel;
  walletDto: WalletDto;
  isNewCard: boolean;
  showPage: boolean;
  ProgressSpinnerDlg = false;
  customerid:string="";

  constructor(private router: Router, private checkoutResponse: CheckoutResponse,private orderservice: OrdermanagementService,
    private walletmanagementService: WalletmanagementService, private localStorage: LocalStorageService) { }

  ngOnInit() {
    this.customerid= this.localStorage.get("customerid");
    const progressSpinnerDlg = <HTMLFormElement>document.getElementById('ProgressSpinnerDlg');
    progressSpinnerDlg.setAttribute('style', 'display:block;');
    this.showPage = false;
    setTimeout(() => {
      this.paymentResponse = this.checkoutResponse.storage;
      this.isNewCard = this.checkoutResponse.isNewCard;
      this.paymentModel = this.checkoutResponse.paymentModel;
      if (this.paymentModel.isFromOrder) {
        this.payOrder();
      } else {
        this.walletInsert();
      }
      progressSpinnerDlg.setAttribute('style', 'display:none;');
    }, 10000);
  }
  payOrder() {
    const progressSpinnerDlg = <HTMLFormElement>document.getElementById('ProgressSpinnerDlg');
    progressSpinnerDlg.setAttribute('style', 'display:block;');
    this.walletDto = new WalletDto();
    this.walletDto.customerID = this.paymentModel.CustomerId;
    this.walletDto.transactionAmount = this.checkoutResponse.paymentModel.Amount;
    this.walletDto.saveCard = this.checkoutResponse.paymentModel.saveCard;
    this.walletDto.isExistingCard = this.paymentModel.isExistingCard;
    this.walletDto.orderID = this.paymentModel.orderID;
    this.walletDto.orderWalletPaymentAmount = sessionStorage.getItem('orderPaymentAmount');
    if (this.walletDto.isExistingCard) {
      this.walletDto.paymentResponseSource = this.checkoutResponse.storage;
    }
    this.walletDto.sourceId = this.checkoutResponse.storage;
    this.walletmanagementService.PayOrder(this.walletDto).subscribe(res => {
      this.showPage = true;
      sessionStorage.removeItem('paymentModel');
      let value = this.walletDto.transactionAmount;
      sessionStorage.setItem('amountPaid', value.toString());
      setTimeout(() => {
        progressSpinnerDlg.setAttribute('style', 'display:none;');
        this.LoadOrders();
      }, 5000);
    });
  }
  walletInsert() {
    const progressSpinnerDlg = <HTMLFormElement>document.getElementById('ProgressSpinnerDlg');
    progressSpinnerDlg.setAttribute('style', 'display:block;');
    this.walletDto = new WalletDto();
    this.walletDto.customerID = this.paymentModel.CustomerId;
    this.walletDto.transactionAmount = this.checkoutResponse.paymentModel.Amount;
    this.walletDto.saveCard = this.checkoutResponse.paymentModel.saveCard;
    this.walletDto.isExistingCard = this.paymentModel.isExistingCard;
    if (this.walletDto.isExistingCard) {
      this.walletDto.paymentResponseSource = this.checkoutResponse.storage;
    }
    this.walletDto.sourceId = this.checkoutResponse.storage;
    this.walletmanagementService.AddPayment(this.walletDto).subscribe(res => {
      this.showPage = true;
      sessionStorage.removeItem('paymentModel');
      setTimeout(() => {
        progressSpinnerDlg.setAttribute('style', 'display:none;');
        this.router.navigateByUrl('customer/customeraccount');
      }, 5000);
    });
  }

  LoadOrders()
  {
    this.orderservice.orderhistorydetailsdata.length=0;
    this.orderservice.orderhistorydetailsdata=[];
    this.orderservice.GetOrderHistory(this.customerid).subscribe(res => {

      if (res.length > 0) {
        this.orderservice.orderhistorydetailsdata = res;   
        const url = this.localStorage.get('returnUrl');  
        this.router.navigateByUrl(url); 
      }
      else {
      }
    });
  }
}
