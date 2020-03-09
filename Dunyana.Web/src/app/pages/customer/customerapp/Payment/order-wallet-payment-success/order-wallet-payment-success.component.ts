import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-wallet-payment-success',
  templateUrl: './order-wallet-payment-success.component.html',
  styleUrls: ['./order-wallet-payment-success.component.scss']
})
export class OrderWalletPaymentSuccessComponent implements OnInit {
  checkinfo: string = 'assets/layout/images/svg/success.svg';
  ProgressSpinnerDlg = false;
  constructor(private router: Router) { }

  ngOnInit() {
    const progressSpinnerDlg  = <HTMLFormElement>document.getElementById('ProgressSpinnerDlg');
    progressSpinnerDlg.setAttribute('style', 'display:block;');
    setTimeout(() => {
      progressSpinnerDlg.setAttribute('style', 'display:none;');
      this.router.navigateByUrl('customer/customeraccount');
  }, 10000);
  progressSpinnerDlg.setAttribute('style', 'display:none;');
  }

}
