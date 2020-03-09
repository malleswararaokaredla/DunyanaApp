import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { UsermanagementService } from '../../customer/services/usermanagement.service';
import { RegistrationDto } from '../../customer/model/DTOs/RegistraionDto';
import { AuthGuard } from 'src/app/shared/auth//_guards';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-merchant-home',
  templateUrl: './merchant-home.component.html',
  styleUrls: ['./merchant-home.component.scss']
})
export class MerchantHomeComponent implements OnInit {
  display: boolean = false;
  editdialogdisplay:boolean=false;
  btnAdd:boolean;
  btnUpdate:boolean;
  mustMatch: string[] = [];
  profiledata:any={};
  listofcountries:any;
  listofcategories:any;
  selecteddiv:string="Legal";

  parentMessage:boolean=true;

  banner=true;
  billing=true;
  legal=true;
  deals=true;

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
    private userservice: UsermanagementService, 
     private authgurd:AuthGuard,private activate:ActivatedRoute,
     private router:Router) { }

  ngOnInit() {
    this.legal=false;
   this.GetProfiledata(); 
  }

  GetProfiledata() {

    this.registerdto.Email = this.localStorage.get("Email");
    this.registerdto.Type=this.localStorage.get("loginType");
    this.userservice.GetProfileInformation(this.registerdto).subscribe(res => {
      this.profiledata=res;
      this.listofcountries=this.profiledata["sellCountries"];
      this.listofcategories=this.profiledata["categories"];
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

  showdiv(msg)
  {
  
    if(msg==="Banner")
    {
      this.banner=false;
      this.billing=true;
      this.legal=true;
      this.deals=true;
      this.parentMessage=false;
      this.selecteddiv="Banner";
    }
    else if(msg==="Billing")
    {
      this.billing=false;
      this.banner=true;
      this.legal=true;
      this.deals=true;
      this.selecteddiv="Billing";
    }
    else if(msg==="Legal")
    {
      this.legal=false;
      this.banner=true;
      this.deals=true;
      this.billing=true;
      this.selecteddiv="Legal";
    }
    else if(msg==="Deals")
    {
      this.deals=false;
      this.banner=true;
      this.legal=true;
      this.billing=true;
      this.selecteddiv="Deals";
      this.btnAdd=true;
      this.btnUpdate=false;
      
    }
  }

  GoFocus() {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      let divfocus = document.getElementById("divfocus").offsetTop;

      if (divfocus) {

        if (pos < divfocus) {
          window.scrollTo(divfocus, divfocus);
        } else {
          window.clearInterval(scrollToTop);
        }
      }
    }, 5);
  }
}
