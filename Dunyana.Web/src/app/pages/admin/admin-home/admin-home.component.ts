import { Component, OnInit } from '@angular/core';
import { RegistrationDto } from '../../customer/model/DTOs/RegistraionDto';
import { LocalStorageService } from 'angular-web-storage';
import { UsermanagementService } from '../../customer/services/usermanagement.service';
import { AuthGuard } from 'src/app/shared/auth/_guards';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
  display: boolean = false;
  editdialogdisplay:boolean=false;
  
  profiledata:any={};
  registerdto: RegistrationDto = {
    Id: 0,
    FirstName: null,
    LastName: null,
    Email: null,
    Mobile: null,
    Address: null,
    Country: null,
    City: null,
    Image: null,
    LoginType: null,
    FBID: null,
    GoogleID: null,
    oldPWD:null,
    PWD: null,
    Type: null,
    EmailVerified: 0,
    Status: 0,
    OTP: 0
  }
  
  constructor(private localStorage: LocalStorageService,
    private userservice: UsermanagementService, private router:Router,
    private authgurd:AuthGuard,private activate:ActivatedRoute,) { }

  ngOnInit() {
    
    this.GetProfiledata();
  }
  GetProfiledata() {

    this.registerdto.Email = this.localStorage.get("Email");
    this.registerdto.Type=this.localStorage.get("loginType");
    this.userservice.GetProfileInformation(this.registerdto).subscribe(res => {
      this.profiledata.Image = res["image"];
      this.profiledata.FirstName = res["firstName"];
      this.profiledata.LastName = res["lastName"];
      this.profiledata.City = res["city"];
      this.profiledata.Address = res["address"];
      this.profiledata.Country = res["country"];
      this.profiledata.Email = res["email"];
      this.profiledata.Id = res["id"];
      this.localStorage.set("naqelid",res["id"]);
      this.profiledata.Mobile = res["mobile"];
      this.localStorage.set("customerid", res["id"]);
      this.profiledata.PWD = res["pwd"];
      this.localStorage.set("walletamount",res["wallet"]);
    });
  }
  onDialogClose(event) {
    this.display = event;
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('noscroll');
  }
  showDialog() {
    if(this.authgurd.canActivate(this.activate.snapshot,this.router.routerState.snapshot))
    {
    this.display = true;
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('noscroll');
    }
  }
  showEditDialog() {
    if(this.authgurd.canActivate(this.activate.snapshot,this.router.routerState.snapshot))
    {
    this.editdialogdisplay = true;    
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('noscroll');
    }
  }

  onEditDialogClose(event) {
    this.editdialogdisplay = event;
    this.GetProfiledata();
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('noscroll');
  }
}
