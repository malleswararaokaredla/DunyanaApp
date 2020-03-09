import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private router:Router,private localStorage: LocalStorageService,) { }

  ngOnInit() {

    if(this.localStorage.get("Email")===null)
    {
      this.localStorage.remove("customerid");
      this.localStorage.remove("walletamount");
      this.localStorage.remove("Email");
      this.localStorage.remove("loginType");
      this.localStorage.remove("otp");
      this.localStorage.remove("timerData");
      this.localStorage.remove("username");


      this.router.navigateByUrl("signin");
    }
    // else if(this.localStorage.get("loginType")!="A")
    // {
    //   this.localStorage.clear();
    //   this.router.navigateByUrl("signin");
    // }
    
  }

}
