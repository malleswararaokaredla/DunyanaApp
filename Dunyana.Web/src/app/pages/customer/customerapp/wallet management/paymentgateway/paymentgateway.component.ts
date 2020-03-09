import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletmanagementService } from '../../../services/walletmanagement.service';
import { SearchingService } from '../../../services/searching.service';
import { WalletDto } from '../../../model/DTOs/WalletDto';
import { LocalStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-paymentgateway',
  templateUrl: './paymentgateway.component.html',
  styleUrls: ['./paymentgateway.component.scss']
})
export class PaymentgatewayComponent implements OnInit {

  constructor(private router: Router,
    private dataservice: WalletmanagementService,
    private _searchingService: SearchingService, private localStorage: LocalStorageService, ) { }

  ProgressSpinnerDlg: boolean = false;
  amountsuccess: boolean = false;

  _walletDto: WalletDto = {
    id: 0,
    customerID: '',
    type: null,
    transaction: null,
    transactionDate: "2019-08-24T13:15:29.275Z",
    transactionAmount: null,
    transactionDescription: null,
    status: 0,
    orderID: 0,
    saveCard: false,
    sourceId: '',
    paymentResponseSource: '',
    isExistingCard: false,
    orderWalletPaymentAmount: 0
  }

  ngOnInit() {

    this.redirecturl();

  }

  redirecturl() {

    this.ProgressSpinnerDlg = true;
    this._walletDto.transactionAmount = this.localStorage.get("newwalletamount");
    this._walletDto.customerID = this.localStorage.get("customerid");

    this._searchingService.Insertwalletmoney(this._walletDto).subscribe(res => {
      //this.div.nativeElement.innerHTML = "Wallet amount added successfully";
      this.ProgressSpinnerDlg = false;
      this.amountsuccess = true;
      setTimeout(() => {
        //this.ProgressSpinnerDlg=false;
        this.router.navigateByUrl('/customer/customeraccount');
      }, 1000);

    }, error => {
      this.ProgressSpinnerDlg = false;
      this.amountsuccess = false;
    });

  }

}
