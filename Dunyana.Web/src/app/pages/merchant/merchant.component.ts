import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.scss']
})
export class MerchantComponent implements OnInit {

  constructor(private localStorage: LocalStorageService, private router: Router) { }

  ngOnInit() {
    if (this.localStorage.get('Email') === null) {
      this.localStorage.remove("username");
      this.localStorage.remove("Email");
      this.localStorage.remove("customerid");
      this.localStorage.remove("otp");
      this.localStorage.remove("PWD");
      this.localStorage.remove("loginType");
      this.localStorage.remove("timerData");
      this.router.navigateByUrl('signin');
    }
    else if(this.localStorage.get('Email')!=null)
    {
       if (this.localStorage.get("loginType") != "M") {
        this.localStorage.remove("username");
        this.localStorage.remove("Email");
        this.localStorage.remove("customerid");
        this.localStorage.remove("otp");
        this.localStorage.remove("PWD");
        this.localStorage.remove("loginType");
        this.localStorage.remove("timerData");
        this.router.navigateByUrl('signin');
      }
    }

  }

}
