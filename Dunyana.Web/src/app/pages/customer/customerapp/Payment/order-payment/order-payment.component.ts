import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
import { OrderPaymentModel } from '../../../model/DTOs/PaymentModel';
import { OrdermanagementService } from '../../../services/ordermanagemet.service';
@Component({
    selector: 'app-order-payment',
    templateUrl: './order-payment.component.html',
    styleUrls: ['./order-payment.component.scss']
})
export class OrderPaymentComponent implements OnInit {
    currencytype:string='';
    walletamount: any;
    orderAmount: any;
    amountPaid: any;
    cardAmount: any;
    ProgressSpinnerDlg = false;
    isValidFormSubmitted: boolean = null;
    orderPaymentModel: OrderPaymentModel = null;
    payForm: FormGroup;
    showCardContent: boolean = null;
    paymentOptions: any = [];
    constructor(private formBuilder: FormBuilder, private router: Router, private localStorage: LocalStorageService,
        private ordermanagementService: OrdermanagementService) { }

    ngOnInit() {
        this.currencytype=this.localStorage.get("customercurrency");
        this.amountPaid = 0;
        this.payForm = this.formBuilder.group({
            cardPayMode: [true],
            walletPayMode: ['']
        });
        this.walletamount = sessionStorage.getItem('Walletamount');
        this.orderAmount = sessionStorage.getItem('orderPaymentAmount');
        this.amountPaid = sessionStorage.getItem('amountPaid');
        this.cardAmount = sessionStorage.getItem('orderPaymentAmount');
        if (Number(this.walletamount) > Number(this.orderAmount)) {
            sessionStorage.setItem('orderPaymentAmount', this.orderAmount.toString());

        } else {
            sessionStorage.setItem('orderPaymentAmount', this.walletamount.toString());
        }
        sessionStorage.setItem('orderCardPaymentAmount', this.cardAmount.toString());
        const payNowButton = <HTMLFormElement>document.getElementById('pay-order-button');
        payNowButton.disabled = false;
        this.paymentOptions.push('c');
        this.showCardContent = false;
    }
    onFormSubmit() {
        this.isValidFormSubmitted = false;
        if (this.payForm.invalid) {
            return;
        }
        this.isValidFormSubmitted = true;
    }
    goBack() {
        const url = this.localStorage.get('returnUrl');
        this.router.navigateByUrl(url);
    }
    handleChange(evt) {
        const target = evt.target;
        const selectWalletChk = <HTMLFormElement>document.getElementById('dwb');
        const selectCardChk = <HTMLFormElement>document.getElementById('sc');
        const payNowButton = <HTMLFormElement>document.getElementById('pay-order-button');
        if (target.checked) {
            if (target.value === 'wallet') {
                if (Number(this.walletamount) > 0) {
                    if (Number(this.walletamount) > Number(this.orderAmount)) {
                        this.cardAmount = 0;
                    } else {
                        this.cardAmount = Number(this.orderAmount) - Number(this.walletamount);
                    }
                } else {

                }
            } else if (target.value === 'card') {
                if (Number(this.walletamount) === 0) {
                    selectWalletChk.setAttribute('disabled', 'disabled');
                } else {
                    selectWalletChk.removeAttribute('disabled');
                }
                selectCardChk.removeAttribute('disabled');
                sessionStorage.setItem('orderCardPaymentAmount', this.cardAmount.toString());

            }
        } else {

            if (target.value === 'wallet') {
                this.cardAmount = this.orderAmount;
            }
        }
        if (this.payForm.get('walletPayMode').value) {
            this.paymentOptions.push('w');
        } else {
            this.paymentOptions = this.paymentOptions.filter(item => item !== 'w');
        }
        if (this.payForm.get('cardPayMode').value) {
            this.paymentOptions.push('c');
        } else {
            this.showCardContent = false;
            this.paymentOptions = this.paymentOptions.filter(item => item !== 'c');
        }
        if (this.paymentOptions.length > 0) {
            if (Number(this.walletamount) < Number(this.orderAmount)) {
                payNowButton.disabled = !this.payForm.get('cardPayMode').value;
            } else {
                payNowButton.disabled = false;
            }
            if (this.payForm.get('walletPayMode').value) {

                if (Number(this.walletamount) > Number(this.orderAmount)) {
                    sessionStorage.setItem('orderPaymentAmount', this.orderAmount.toString());
                } else {
                    sessionStorage.setItem('orderPaymentAmount', this.walletamount.toString());
                }
            } else {
                sessionStorage.setItem('orderPaymentAmount', '0');
            }
            sessionStorage.setItem('orderCardPaymentAmount', this.cardAmount.toString());
        } else {
            payNowButton.disabled = true;
        }
    }

    submitFrm() {
        if (this.payForm.get('walletPayMode').value) {
            if (Number(this.walletamount) > Number(this.orderAmount)) {
                sessionStorage.setItem('orderPaymentAmount', this.orderAmount.toString());
            } else {
                sessionStorage.setItem('orderPaymentAmount', this.walletamount.toString());
            }
        } else {
            sessionStorage.setItem('orderPaymentAmount', '0');
        }

        if (this.payForm.get('walletPayMode').value && Number(this.walletamount) > 0) {
            this.showCardContent = false;
            this.orderPaymentModel = new OrderPaymentModel();
            this.orderPaymentModel.customerId = this.localStorage.get('customerid');
            this.orderPaymentModel.orderID = sessionStorage.getItem('orderId');
            this.orderPaymentModel.orderAmount = sessionStorage.getItem('orderPaymentAmount');
            if (Number(this.cardAmount) > 0) {
            } else {
                this.ordermanagementService.OrderWalletPayment(this.orderPaymentModel).subscribe(res => {
                    this.router.navigateByUrl('customer/order-wallet-payment-success');
                });
            }
        }
        if (this.payForm.get('cardPayMode').value && Number(this.cardAmount) > 0) {
            this.router.navigateByUrl('customer/customercard-detials');
        }
    }

}
