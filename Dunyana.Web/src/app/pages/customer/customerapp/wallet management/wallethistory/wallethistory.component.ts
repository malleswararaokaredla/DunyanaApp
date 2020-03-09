import { Component, OnInit } from '@angular/core';
import { WalletmanagementService } from '../../../services/walletmanagement.service';
import { LocalStorageService } from 'angular-web-storage';
import { PagerService } from '../../../services/pager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallethistory',
  templateUrl: './wallethistory.component.html',
  styleUrls: ['./wallethistory.component.scss']
})
export class WallethistoryComponent implements OnInit {
  currencytype:string='';
  pagedItems: any[] = [];
  parentMessage: string = "Start Shopping";
  customerid: number = 186;
  Walletamount: number = 0;
  pager: any = {};
  wallethistory: any[] = [];
  isempty: boolean = true;
  ProgressSpinnerDlg: boolean = false;

  constructor(private dataservice: WalletmanagementService,
    private localStorage: LocalStorageService,
    private pagerService: PagerService, private router: Router) { }

  ngOnInit() {
    this.currencytype=this.localStorage.get("customercurrency");
    this.gotoTop();
    if (this.localStorage.get("walletamount") === null) {
      this.Walletamount = 0;
    }
    else {
      this.Walletamount = this.localStorage.get("walletamount");
    }
    this.ProgressSpinnerDlg = true;

    this.dataservice.GetWalletHistory(this.localStorage.get("customerid")).subscribe(res => {
      if (res.length > 0) {
        this.wallethistory = res;
        this.setPage(1);
      }

      else {
        this.isempty = false;
        this.ProgressSpinnerDlg = false;
      }

    });

  }

  gotoTop() {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20);
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 5);
  }
  setPage(page: number) {
    this.pagedItems = [];
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.wallethistory.length, page, 5);
    this.pagedItems = this.wallethistory.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.ProgressSpinnerDlg = false;
  }
  backtoaccountpage() {
    this.router.navigateByUrl("customer/customeraccount");
  }

}
