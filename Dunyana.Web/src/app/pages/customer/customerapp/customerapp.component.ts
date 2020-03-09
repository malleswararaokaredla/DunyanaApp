import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';
import { HeaderComponent } from './shared/header/header.component';
import {HttpClient} from '@angular/common/http';
import { IpmanagementService } from '../services/Ipmanagement.service';

@Component({
  selector: 'app-customerapp',
  templateUrl: './customerapp.component.html',
  styleUrls: ['./customerapp.component.scss']
})
export class CustomerappComponent implements OnInit {
  ipAddress:any;

  constructor(private router: Router, private localStorage: LocalStorageService,
    private http: HttpClient) { 

    // this.http.get<{ip:string}>('https://jsonip.com')
    // .subscribe( data => {
    //   console.log('th data', data);
    //   this.ipAddress = data
    // });


  }
  ngOnInit() {

    if (document.getElementById('search_container')) {
      var r = document.getElementById('search_container');
      r.setAttribute('style', 'display:none;');
    }
    if (this.router.url === '/customer/payment-success') {

      this.router.navigateByUrl('customer/payment-success');
      return;
    }
    if (this.router.url === '/customer/payment-failure') {

      this.router.navigateByUrl('customer/payment-failure');
      return;
    }
    if (this.router.url.indexOf('/customer/checkout3DS') >= 0) {

      this.router.navigateByUrl('customer/checkout3DS');
      return;
    }
    if (this.localStorage.get('Email') === null) {
      this.localStorage.remove("customerid");
      this.localStorage.remove("walletamount");
      this.localStorage.remove("Email");
      this.localStorage.remove("loginType");
      this.localStorage.remove("otp");
      this.localStorage.remove("timerData");
      this.localStorage.remove("username");
      this.router.navigateByUrl('customer/home');
    }
    else {
      if (this.localStorage.get("loginType") === "C") {
        this.router.navigateByUrl('customer/customeraccount');
      }
      else if (this.localStorage.get("loginType") === "NSA") {
        this.router.navigateByUrl('admin/profile');
      }
      else if (this.localStorage.get("loginType") === "M") {
        this.router.navigateByUrl('merchant/profile');
      }
      else if (this.localStorage.get("loginType") === "NF" || this.localStorage.get("loginType") === "NL" || this.localStorage.get("loginType") === "NC") {
        this.router.navigateByUrl('admin/profile');
      }
    }

  }

}
