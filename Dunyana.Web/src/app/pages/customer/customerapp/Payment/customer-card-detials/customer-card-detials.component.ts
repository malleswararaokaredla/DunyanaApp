import { Component, OnInit } from '@angular/core';
import { PaymentModel } from '../../../model/DTOs/PaymentModel';
import {WalletmanagementService } from '../../../services/walletmanagement.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'angular-web-storage';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CheckoutResponse } from '../CheckoutResponse';

declare var Frames: any;

@Component({
  selector: 'app-customer-card-detials',
  templateUrl: './customer-card-detials.component.html',
  styleUrls: ['./customer-card-detials.component.scss']
})
export class CustomerCardDetialsComponent implements OnInit {
  paymentForm: FormGroup;
  currencytype:string='';
  paymentModel: PaymentModel;
  CardTokenValue: string;
  ProgressSpinnerDlg = false;
  customerId: any;
  amount: any;
  cardTypes: any[] = [];
  isFromOrder: boolean;

  constructor(private router:Router, private walletmanagementService: WalletmanagementService, private fb: FormBuilder,
    private localStorage: LocalStorageService, private formBuilder: FormBuilder, private checkoutResponse: CheckoutResponse) { }

  ngOnInit() {
    this.currencytype=this.localStorage.get("customercurrency");
    this.isFromOrder = false;
    if (sessionStorage.getItem('orderCardPaymentAmount') != null) {     
      this.amount = sessionStorage.getItem('orderCardPaymentAmount');
      const amountContent = <HTMLFormElement>document.getElementById('Amount');
      amountContent.setAttribute('disabled', 'true');
      this.isFromOrder = true;
    } else {
      this.amount = this.localStorage.get('newwalletamount');
      const amountContent = <HTMLFormElement>document.getElementById('amountContent');
      amountContent.setAttribute('style', 'display:none;');
    }
    this.customerId = this.localStorage.get('customerid');
    this.getPaymentCards();
    this.paymentForm = this.formBuilder.group({
      Amount: ['', [Validators.required]],
      cardType: ['', [Validators.required]]
    });

     this.paymentCheckout();
  }
getPaymentCards() {

  this.walletmanagementService.GetPaymentCards(this.localStorage.get('customerid')).subscribe(res => {
    this.cardTypes.push({ label: 'Select', value: '' });
    this.cardTypes.push({ label: 'Add new credit/debit card', value: '0' });
  Object.keys(res).map(key => (
    this.cardTypes.push({ label: res[key]['cardType'] + '****' + res[key]['last4digits'], value: res[key]['paymentcardId'] })
  ));

  this.paymentForm.controls['cardType'].setValue('');
  });
}
  formInit() {
    this.paymentForm = this.formBuilder.group({
      CardToken: [''],
      Amount: [''],
      Currency: [''],
      cardType: ['', [Validators.required]]
    });
  }
   paymentCheckout() {

    const paymentForm = <HTMLFormElement>document.getElementById('payment-form');
    const payNowButton = <HTMLFormElement>document.getElementById('pay-now-button');
    const CardToken = <HTMLFormElement>document.getElementById('CardToken');
    const progressSpinnerDlg  = <HTMLFormElement>document.getElementById('ProgressSpinnerDlg');
    const customerId = <HTMLFormElement>document.getElementById('CustomerId');

    Frames.init({
        publicKey: environment.CHECKOUT_PUBLICK_KEY,
        containerSelector: '.frames-container',
        debugMode: true,
        cardValidationChanged: function () {
            payNowButton.disabled = !Frames.isCardValid();
        },
        cardSubmitted: function () {
            payNowButton.disabled = true;
        },
      
        cardTokenisationFailed: function (event) {
        }
    });
    payNowButton.disabled = !this.paymentForm.valid;
   }

   submitFrm() {
     const cardType = this.paymentForm.get('cardType').value;
     const progressSpinnerDlg  = <HTMLFormElement>document.getElementById('ProgressSpinnerDlg');
     if (cardType === '0') {
    progressSpinnerDlg.setAttribute('style', 'display:block;');
    Frames.submitCard().then(function (data) {
          const paymentForm = <HTMLFormElement>document.getElementById('payment-form');
          Frames.addCardToken(paymentForm, data.token);
          const cardTokenVal = data.cardToken;
          this.CardToken.value = cardTokenVal;
          this.CardBin.value = data.card.bin;
          this.CardTokenValue = cardTokenVal;
        const payTempBtn = <HTMLFormElement>document.getElementById('payTemp');
        payTempBtn.click();
        setTimeout(() => {
          progressSpinnerDlg.setAttribute('style', 'display:block;');
        }, 5000);

    })
      .catch(function (error) {
        progressSpinnerDlg.setAttribute('style', 'display:none;');
      });
    } else {
      progressSpinnerDlg.setAttribute('style', 'display:block;');
      const payTempBtn = <HTMLFormElement>document.getElementById('payTemp');
      payTempBtn.click();
      setTimeout(() => {
        progressSpinnerDlg.setAttribute('style', 'display:block;');
      }, 5000);
    }
  }

  apiSubmit() {
    this.localStorage.set('newwalletamount', 0);
    const cardToken = <HTMLFormElement>document.getElementById('CardToken');
    const cardBin = <HTMLFormElement>document.getElementById('CardBin');
    const amount = <HTMLFormElement>document.getElementById('Amount');
    const currency = <HTMLFormElement>document.getElementById('Currency');
    const saveCard = <HTMLFormElement>document.getElementById('saveCard');
    const cardType = this.paymentForm.get('cardType').value;
    this.paymentModel = new PaymentModel();
    const _orderId = sessionStorage.getItem('orderId');
    this.paymentModel.orderID =_orderId;
    this.paymentModel.CardToken = cardToken.value;
    this.paymentModel.cardBin = cardBin.value;
    this.paymentModel.Amount = amount.value;
    this.paymentModel.Currency = currency.value;
    this.paymentModel.Reference = 'card payment';
    this.paymentModel.Capture = false;
    this.paymentModel.DoThreeDS = true;
    this.paymentModel.CustomerId = this.localStorage.get('customerid');
    this.paymentModel.saveCard = saveCard.checked ? true : false;
    if (cardType === '0') {
      this.paymentModel.isExistingCard = false;
    } else {
      const cvv = <HTMLFormElement>document.getElementById('cvv');
      this.paymentModel.paymentCardId = cardType;
      this.paymentModel.cvv = cvv.value;
      this.paymentModel.isExistingCard = true;
    }
    this.paymentModel.isFromOrder = this.isFromOrder;
    this.walletmanagementService.MakePayment(this.paymentModel).subscribe(res => {
       this.checkoutResponse.storage = res;
       if (this.paymentModel.isExistingCard) { this.checkoutResponse.isNewCard = false; }
       this.checkoutResponse.paymentModel = this.paymentModel;
       sessionStorage.setItem('paymentModel', JSON.stringify(this.paymentModel));
          if (res.payment != null) {
             if (res.payment.responseCode === '10000') {
              this.router.navigateByUrl('customer/payment-success');
             } else {
              this.router.navigateByUrl('customer/payment-failure');
             }
          } else {
          if (res.isPending) {
            window.location.href = res.pending._links.redirect.href;
          } else {
            this.router.navigateByUrl('customer/payment-exception');
          }
        }
     });
  }

  formvalidate(event) {
    const framescontainer = <HTMLFormElement>document.getElementById('frames-container');
    const payNowButton = <HTMLFormElement>document.getElementById('pay-now-button');
    const cvv = <HTMLFormElement>document.getElementById('cvvContent');
    const saveCardContent = <HTMLFormElement>document.getElementById('saveCardContent');
    const cvvTxt = <HTMLFormElement>document.getElementById('cvv');
    if(event.value === '0') {
     this.paymentCheckout();
      framescontainer.setAttribute('style', 'display:block;');
       cvv.setAttribute('style', 'display:none;');
       saveCardContent.setAttribute('style', 'display:block');
      payNowButton.disabled = true;
    } else if (event.value === '') {
      framescontainer.setAttribute('style', 'display:none;');
      cvv.setAttribute('style', 'display:none;');
      saveCardContent.setAttribute('style', 'display:none');
      payNowButton.disabled = true;

    } else if (event.value !== '0') {
      framescontainer.setAttribute('style', 'display:none;');
      saveCardContent.setAttribute('style', 'display:none');
      cvvTxt.value = '';
       cvv.setAttribute('style', 'display:block;');
      payNowButton.disabled = true;
    }
  }

  cvvValidation(val) {
    const payNowButton = <HTMLFormElement>document.getElementById('pay-now-button');
    payNowButton.disabled = val.length > 2 ?  false : true;
   }
   goBack() {
    const url = this.localStorage.get('returnUrl');
    this.router.navigateByUrl(url);
}
}
