import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { WalletmanagementService } from '../../../services/walletmanagement.service';
import { PagerService } from '../../../services/pager.service';
import { Router } from '@angular/router';
import { UsermanagementService } from '../../../services/usermanagement.service';
import { LocalStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-walletpoints',
  templateUrl: './walletpoints.component.html',
  styleUrls: ['./walletpoints.component.scss']
})
export class WalletpointsComponent implements OnInit {

  pagedItems: any[] = [];
  parentMessage: string = "Start Shopping";
  pager: any = {};
  wallethistory: any[] = [];
  isempty: boolean = true;
  ProgressSpinnerDlg: boolean = false;
  pointsData: any = [];

  constructor(private dataservice: WalletmanagementService,
    private userservice: UsermanagementService,
    private localStorage: LocalStorageService,
    private pagerService: PagerService, private router: Router) { }

  ngOnInit() {
    this.ProgressSpinnerDlg = true;
    this.getPointsHistory();
   }

  getPointsHistory() {
    this.userservice.GetUserPointsHistory(this.localStorage.get('customerid')).subscribe(res => {
      console.log('RESPONSE ===>>> ', res);
      if (res.length > 0) {
        this.pointsData = res;
        this.setPage(1);
      }
    });
  }

  setPage(page) {
    this.pagedItems = [];
    this.pager = this.pagerService.getPager(this.pointsData.length, page, 5);
    this.pagedItems = this.pointsData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.ProgressSpinnerDlg = false;
  }

  backtoaccountpage() {
    this.router.navigateByUrl('customer/customeraccount');
  }

  gotoOrders(orderId) {
    //if (orderId !== null) {
    //  this.router.navigateByUrl('customer/orderdetails/' + orderId);
    //}
  }

}
