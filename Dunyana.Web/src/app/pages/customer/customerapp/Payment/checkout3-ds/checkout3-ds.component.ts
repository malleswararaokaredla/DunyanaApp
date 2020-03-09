import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WalletmanagementService } from '../../../services/walletmanagement.service';
import { CheckoutResponse } from '../CheckoutResponse';
@Component({
  selector: 'app-checkout3-ds',
  templateUrl: './checkout3-ds.component.html',
  styleUrls: ['./checkout3-ds.component.scss']
})
export class Checkout3DSComponent implements OnInit {

  constructor(private router: ActivatedRoute, private route: Router,  private walletmanagementService: WalletmanagementService, private checkoutResponse: CheckoutResponse) { }

  ngOnInit() {
    const ckosessionid = this.router.snapshot.queryParams['cko-session-id'];
    const progressSpinnerDlg  = <HTMLFormElement>document.getElementById('ProgressSpinnerDlg');
    progressSpinnerDlg.setAttribute('style', 'display:block;');
    this.walletmanagementService.CheckPayment(ckosessionid).subscribe(res => { 
       this.checkoutResponse.storage = res;
       this.checkoutResponse.paymentModel = JSON.parse(sessionStorage.getItem('paymentModel'));
          if (res.approved) {
              this.route.navigateByUrl('customer/payment-success');
          } else {
              this.route.navigateByUrl('customer/payment-failure');
          }
    });

  }

}
