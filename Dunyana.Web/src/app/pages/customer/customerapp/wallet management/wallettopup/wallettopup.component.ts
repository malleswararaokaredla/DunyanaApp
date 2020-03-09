import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { WalletDto } from '../../../model/DTOs/WalletDto';
import { SearchingService } from '../../../services/searching.service';
import { WalletmanagementService } from '../../../services/walletmanagement.service';

@Component({
  selector: 'app-wallettopup',
  templateUrl: './wallettopup.component.html',
  styleUrls: ['./wallettopup.component.scss']
})
export class WallettopupComponent implements OnInit {

  @ViewChild('div') div: ElementRef;
  currencytype:string='';
  btndisable: string = "disable";
  walletvalidmsg: string;
  responsesty: string = '';
  customerid: number;
  wallethistory: number = 0;
  walletForm: FormGroup;
  txtErrormsg: boolean = true;
  transactionAmout: number;
  transactionDate: string;
  ProgressSpinnerDlg: boolean = false;


  walletformat: string = "^(^\d{0,5})+(\.\d{1,2})?$";

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

  constructor(private formBuilder: FormBuilder, private localStorage: LocalStorageService,
    private router: Router, private _searchingService: SearchingService, private dataservice: WalletmanagementService) { }

  ngOnInit() {
    sessionStorage.removeItem('orderPaymentAmount');
    sessionStorage.removeItem('orderCardPaymentAmount');
    this.currencytype=this.localStorage.get("customercurrency");
    this.getupdatedwallet();
    this.customerid = this.localStorage.get("customerid");
    this.transactionAmout = this.localStorage.get("walletamount");

    this.walletForm = this.formBuilder.group({
      transactionAmount: ['', [Validators.required, Validators.pattern(/^(^\d{0,5})+(\.\d{1,2})?$/)]],
    });
  }

  formvalidation() {

    var reg = "/^(^\d{0,5})+(\.\d{1,2})?$";

    if (this._walletDto.transactionAmount != null) {
      if (this._walletDto.transactionAmount != 0) {
        if (this._walletDto.transactionAmount.toString().match(/^(^\d{0,5})+(\.\d{1,2})?$/)) {
          this.walletvalidmsg = "";
          this.btndisable = "";
        } else {
          this.walletvalidmsg = "Please enter valid amount";
          this.btndisable = "disable";
          this.txtErrormsg = false;
        }
      }
      else {
        this.walletvalidmsg = "Please enter amount";
        this.btndisable = "disable";
        this.txtErrormsg = false;
      }
    } else {
      this.walletvalidmsg = "Please enter amount";
      this.btndisable = "disable";
      this.txtErrormsg = false;
    }

  }

  getupdatedwallet() {
    this.dataservice.GetWalletHistory(this.localStorage.get("customerid")).subscribe(res => {
      this.wallethistory = res;
      if (res.length > 0) {
        this.transactionDate = res[0]['transactionDate'];
      }
    });
  }

  public restrictNumeric(el: string, evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if ((charCode != 46 || el.indexOf('.') != -1) && (charCode < 48 || charCode > 57)) {
      if ((charCode != 46 || el.indexOf('.') != -1)) {
        return false;
      }
    }

    if (el.length == 5 && el.indexOf(".") == -1) {
      if (charCode != 46) {
        return false;
      }
    }
  }


  insertWalletMoney() {

    this.ProgressSpinnerDlg = true;

    if (this.walletForm.invalid) {
      this.txtErrormsg = false;
      this.walletvalidmsg = "Please enter valid amount";
      this.ProgressSpinnerDlg = false;
      return
    }
    else {
      this.walletvalidmsg = "";
      if (this._walletDto.transactionAmount == 0) {
        this.walletvalidmsg = "Please enter valid amount";
        this.txtErrormsg = false;
        this.ProgressSpinnerDlg = false;
      }
      else {
        this.walletvalidmsg = "";

        this.localStorage.set("newwalletamount", this._walletDto.transactionAmount);
        this.ProgressSpinnerDlg = false;
        this.localStorage.set('returnUrl', this.router.url);
        this.router.navigateByUrl('/customer/customercard-detials');
      }
    }

  }
  ResetForm() {
    this.walletForm.reset({
      "Amount": ''
    })
  }

  HideResponse() {
    setTimeout(() => {
    }, 5000);
  }

}
