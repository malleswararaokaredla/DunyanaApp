import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { User } from '../../model/user';
import { UsermanagementService } from '../../services/usermanagement.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'angular-web-storage';
import { AuthenticationService } from '../../../../shared/auth/_services';
import { IpmanagementService } from '../../services/Ipmanagement.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  forgotspinner: boolean = true;
  forgotresmsg: any;
  loginForm: FormGroup;
  ForgetForm: FormGroup;
  @ViewChild('div') div: ElementRef;
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  @ViewChild('Ferror') Ferror: ElementRef;
  public show = false;
  emailvaliderrormsg: string = "";
  passwordpattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$_])(?=.{8,})';

  userdata: any;

  headerlogo: string = "assets/layout/images/glogo.png";
  lang = 'en';
  userPostData: User = {
    Email: "",
    FirstName: "",
    LastName: "",
    Mobile: "",
    Address: "",
    Country: "",
    City: "",
    Image: "",
    EmailVerified: 0,
    LoginType: "",
    FBID: "",
    GoogleID: "",
    PWD: "",
    Type: "",
    token: ''

  };
  public responseData: any;
  base64textString: string;
  file: any;
  Image: any;
  isBrowser: boolean;
  base64Image: any;
  submitted: boolean = false;
  ProgressSpinnerDlg: boolean = false;
  display: boolean = false;
  btndisable: string = "disable";
  btnfdisable: string = "disable";
  constructor(private dataservice: UsermanagementService, public translate: TranslateService, private localStorage: LocalStorageService,
    private router: Router, private formBuilder: FormBuilder, private messageService: MessageService,private ipmanagement:IpmanagementService,
    private authenticationService: AuthenticationService) {
    this.dataservice.sessionIn();
  }

  showDialog() {
    this.display = true;
  }
  onDialogClose(event) {
    this.display = event;
  }

  ngOnInit() {
   
    this.ipmanagement.Getipinfo().subscribe(res=>{
      this.localStorage.set("countryname",res["country_name"]);
      //this.Executeinitcode();
  });

    setTimeout(() => {
      document.getElementById('lEmail').focus()
    }, 0);
    if (this.localStorage.get('lang') != null) {
      this.lang = this.localStorage.get('lang');
      this.translate.use(this.lang);
    }
    else {
      this.translate.use(this.lang);
    }
    this.loginForm = this.formBuilder.group({
      lEmail: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{1,}[.]{1}[a-zA-Z]{2,}')]],
      lPassword: ['', [Validators.required]],
    });

    this.ForgetForm = this.formBuilder.group({
      FEmail: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{1,}[.]{1}[a-zA-Z]{2,}')]]
    });

    this.ProgressSpinnerDlg = false;

    if (this.localStorage.get('Email') != null) {

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
      else {

        this.localStorage.remove("username");
        this.localStorage.remove("Email");
        this.localStorage.remove("customerid");
        this.localStorage.remove("otp");
        this.localStorage.remove("PWD");
        //this.localStorage.clear();
        this.localStorage.remove("loginType");
        this.localStorage.remove("timerData");
        sessionStorage.clear();
        // this.localStorage.clear();

      }
    }
  }



  OnLogin() {

    this.submitted = true;
    this.ProgressSpinnerDlg = true;

    this.userPostData.Email = this.loginForm.controls.lEmail.value;
    this.userPostData.PWD = this.loginForm.controls.lPassword.value;

    this.authenticationService.login(this.userPostData).subscribe(res => {
      if (res["loginType"] != null) {

        this.ProgressSpinnerDlg = false;
        this.userdata = res['reFirstName'];
        this.localStorage.set('username', this.userdata);
        this.localStorage.set('Email', res['reEmail']);
        this.localStorage.set('loginType', res["loginType"]);
        sessionStorage.setItem('token', res['token']);
        sessionStorage.setItem('loggedInUserId', res['resultData'].id);

        if (res["loginStatus"] == 1) {
          this.show = false;
          this.div.nativeElement.innerHTML = res["result"];
          if (res["loginType"] == "C") {
            this.router.navigateByUrl("customer/home");
            if (this.localStorage.get("merchanturl") != null) {
              window.open(this.localStorage.get("merchanturl"), "_blank");
              this.localStorage.remove("merchanturl");
            }
          }
          else if (res["loginType"] == "M") {
            this.router.navigateByUrl("merchant/profile");
          }

          else if (res["loginType"] == "NL" || res["loginType"] == "NF") {
            this.router.navigateByUrl("admin/profile");
          }
          else if (res["loginType"] == "NSA") {
            this.router.navigateByUrl("admin/profile");
          }
          else {

            this.localStorage.remove("username");
            this.localStorage.remove("Email");
            this.localStorage.remove("customerid");
            this.localStorage.remove('customercurrency');
            this.localStorage.remove("loginType");
            //this.localStorage.clear();
            this.localStorage.remove("otp");
            this.localStorage.remove("PWD");
            this.localStorage.remove("timerData");
            sessionStorage.clear();
          }

          this.Resetlog();
        }
        else if (res["loginStatus"] == 0) {
          this.show = false;

          this.div.nativeElement.innerHTML = "This account is deactivated.<br> Please contact the customer care...";
          this.localStorage.remove("username");
          this.localStorage.remove("Email");
          this.localStorage.remove("loginType");
        }

        else if (res["loginStatus"] == 2) {
          this.show = false;
          this.localStorage.remove("username");
          this.localStorage.remove("Email");
          this.localStorage.remove("loginType");
          this.div.nativeElement.innerHTML = 'Account is locked';
        }

        else if (res["loginStatus"] == 3) {
          this.show = false;
          this.localStorage.remove("username");
          this.localStorage.remove("Email");
          this.localStorage.remove("loginType");
          this.div.nativeElement.innerHTML = "Your account is barred";
        }
        else if (res["loginStatus"] === null) {
          this.show = false;

          this.div.nativeElement.innerHTML = res["result"];
        }
      }
      else {
        this.ProgressSpinnerDlg = false;
        this.show = false;
        this.div.nativeElement.innerHTML = res["result"];
        this.localStorage.remove("selectedcatgid");
      }
    },
      errormsg => {
        this.ProgressSpinnerDlg = false;
      });

  }




  Resetlog() {
    this.loginForm.reset({
      'lEmail': '',
      'lPassword': ''
    })
  }

  ResetForgot() {
    this.ForgetForm.reset({
      'FEmail': ''
    })
  }
  cancel() {
    this.closeAddExpenseModal.nativeElement.click();
  }

}