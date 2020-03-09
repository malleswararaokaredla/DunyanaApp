import { Component, OnInit, ElementRef, Input, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MustMatch } from 'src/app/shared/validators/PasswordMustMatchvalidator';
import { RegistrationDto } from '../../model/DTOs/RegistraionDto';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UsermanagementService } from '../../services/usermanagement.service';
import { MessageService } from 'primeng/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'angular-web-storage';
import { Observable, Subscription } from 'rxjs/Rx';

import { registererrormsg } from '../../model/registererrormsg';
import { InsertCustomerRegistrationDto } from '../../model/DTOs/InsertCustomerRegistrationDto';
import { TermsConditionsComponent } from '../../customerapp/About/terms-conditions/terms-conditions.component';
import { AuthenticationService } from 'src/app/shared/auth/_services';
import { User } from '../../model/user';
import { MobileOTPDto } from '../../model/DTOs/MobileOTPDto';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  _timeout: any = null;
  caretPos: number = 0;
  lang = 'en';
  headerlogo: string = "assets/layout/images/glogo.png";
  checkinfo: string = "assets/layout/images/svg/success.svg";
  ProgressSpinnerDlg: boolean = false;
  registrationForm: FormGroup;
  FirstregistrationForm: FormGroup;
  submitted = false;
  countries: any[] = [];
  default: string = 'United States';
  btndisable: string = "disable";
  currentIndex: string;
  hidenextbtn: boolean = false;
  activetab: string = "active";
  submitbtntext: string = "Next";
  timerbtntext: string = "Resend in";
  prevbtn: string = "none";
  topheader: string = "";
  userdata: any;
  otpnumb: string = "";
  response: string = "";
  responsesty: string = "";
  iserror: boolean = true;
  issucss: boolean = true;
  errormsg: string = "";
  succsmsg: string = "";
  txterrormsg: boolean = true;
  txterrorresponse: string = "";
  nextslide: string = "next";
  namepattern: string = '^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$';
  citypattern: string = '^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$';
  addresspattern: string = '^([A-Za-z0-9,-/]+ )+[A-Za-z0-9,-/]+$|^[A-Za-z0-9,-/]+$';
  passwordpattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$_])[A-Za-z\d@$!_]{8,}$';
  // emailpatrn = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{1,}[.]{1}[a-zA-Z]{2,}';
  emailpatrn = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  finalImage: any = '';
  display: boolean = false;
  termesdialogdisplay: boolean = false;
  emailvaliderrormsg: string = "";
  pwdvaliderrormsg: string = "";
  phonevaliderrormsg: string = "";
  timerbtndisplay: boolean = true;
  mobiletimerbtndisplay: boolean = true;
  verifybtndisplay: boolean = false;
  callDuration: string = '';
  resendtext: string = 'Resend in 00:00';
  timetaken: any = '';
  timerdata: any = '';
  mtimerdata: any = '';
  mbtnotpdis: string = "disable";
  btnotpdis: string = "disable";

  otpdisable: boolean = false;
  otpresponse: string = "";
  selectedcountrycode: string = "";
  resetTimer: boolean = false;


  private subscription: Subscription;
  private mobilesubscription: Subscription;

  ruleschecked: boolean = false;
  TermandCondition: string = "";

  @ViewChild(TermsConditionsComponent)
  private termsNCond: TermsConditionsComponent;

  addregisterdto: InsertCustomerRegistrationDto = {
    FirstName: null,
    LastName: null,
    Email: null,
    Mobile: null,
    Address: null,
    Country: null,
    City: null,
    LoginType: null,
    PWD: null,
    TermandCondition: null,
    OTP: 0,
    mobileOTP: 0
  }


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
    oldPWD: null,
    PWD: null,
    Type: null,
    EmailVerified: 0,
    Status: 0,
    OTP: 0
  }
  registererrormsg: registererrormsg =
    {
      firstname: null,
      lastname: null,
      email: null,
      mobile: null,
      address: null,
      country: null,
      password: null
    }
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

  mobileotp: MobileOTPDto = {

    mobile: null,
    mobilewithcountrycode: null
  }


  Otp: string = null;
  MOtp: string = null;
  EmailOtp: number = 0;
  PhoneOtp: number = 0;

  cars: any[];
  constructor(private formBuilder: FormBuilder, private userservice: UsermanagementService,
    private messageService: MessageService, private ngxService: NgxUiLoaderService,
    public translate: TranslateService, private localStorage: LocalStorageService, private authenticationService: AuthenticationService,
    private router: Router, private elementRef: ElementRef) {

  }

  ngOnInit() {

    setTimeout(() => {
      document.getElementById('firstname').focus();
    }, 0);

    this.GetCountriesList();

    if (this.localStorage.get('lang') != null) {
      this.lang = this.localStorage.get('lang');
      this.translate.use(this.lang);
    }
    else {
      this.translate.use(this.lang);
    }
    this.registrationForm = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      lastname: ['', [Validators.required, Validators.pattern(this.namepattern)]],
      emailid: ['', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      address: [''],
      country: ['', Validators.required],
      city: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_])[A-Za-z\d@$!_]{8,}$/), Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_])[A-Za-z\d@$!_]{8,}$/), Validators.minLength(8)]],
      otp: ['', Validators.required],
      motp: ['', Validators.required],
      terms: []
    },
      {
        validator: MustMatch('password', 'confirmpassword')
      }
    );
  }


  _keyPress(event: any) {
    const pattern = /^([0-9]+ )+[0-9]+$|^[0-9]+$/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  validatepassword(event: any) {
    var k = event ? event.which : event.KeyCode;
    if (k == 32) return false;
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  showDialog() {
    this.display = true;
  }

  saveCropImage() {
    this.finalImage = this.croppedImage;
  }

  formvalidate() {
    if (this.registrationForm.valid) {
      this.btndisable = "line_btn sblue";
    }
    else {
      this.btndisable = "disable";
    }
  }
  basicformvalidate() {
    if (this.registerdto.FirstName != null) {

      if (this.registerdto.FirstName.match(this.namepattern)) {

        if ((this.registerdto.FirstName.length - 1 > -1)) {

          if (this.registerdto.LastName != null) {

            if (this.registerdto.LastName.match(this.namepattern)) {
              if (this.registerdto.LastName.length - 1 > -1) {
                this.btndisable = "line_btn sblue";
              }
              if (this.registerdto.LastName.length == 0) {
                this.btndisable = "disable";
              }
            }
            else {
              this.btndisable = "disable";
            }

          }
          else {
            this.btndisable = "disable";
          }

        }
        else {
          this.btndisable = "disable";
        }
      }
      else {
        this.btndisable = "disable";
      }

    }
    else {

      this.btndisable = "disable";
    }
  }

  formauthdatavalidate() {
    this.btndisable = "disable";

    if (this.registerdto.Email != null) {
      if (this.registerdto.Email.length > 0) {
        if (this.registerdto.Email.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)) {
          this.txterrormsg = true;
          this.emailvaliderrormsg = "";
          if (this.registerdto.PWD != null) {
            if (this.registerdto.PWD.length >= 6) {
              if (this.registerdto.PWD.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_])[A-Za-z\d@$!_]{8,}$/)) {

                this.txterrormsg = true;
                this.pwdvaliderrormsg = "";

                if (this._timeout) {
                  clearTimeout(this._timeout);
                }

                this._timeout = window.setTimeout(() => {
                  this._timeout = null;
                  this.CheckEmail();
                }, 500);
              }
              else {
                this.btndisable = "disable";
                this.txterrormsg = false;
                this.pwdvaliderrormsg = "The password length must be 8 to 12 characters and it should contain at least 1 uppercase,1 lowercase, 1 special character($,@,!,_) and 1 numeric.";
              }
            }
            else if (this.registerdto.PWD.length == 0) {
              this.txterrormsg = false;
              this.pwdvaliderrormsg = "";
              this.btndisable = "disable";
            }
            else if ((this.registerdto.PWD.length < 6) && (this.registerdto.PWD.length > 0)) {
              this.btndisable = "disable";
              this.txterrormsg = false;
              this.pwdvaliderrormsg = "The password length must be 8 to 12 characters and it should contain at least 1 uppercase,1 lowercase, 1 special character($,@,!,_) and 1 numeric.";
            }

          }
          else {
            this.btndisable = "disable";
          }
        }
        else {
          this.txterrormsg = false;
          this.emailvaliderrormsg = "Please enter valid email";
          this.btndisable = "disable";
        }
      }
      else {
        this.txterrormsg = false;
        this.emailvaliderrormsg = "Please enter email";
        this.btndisable = "disable";
      }

    }
    else {
      this.btndisable = "disable";
    }
  }

  Addressformvalidate() {

    if (this.registerdto.City != null) {
      if (this.registerdto.City.match(this.namepattern)) {
        if (this.registerdto.City.length - 1 > -1) {
          // if (this.registerdto.Address != null) {
          //   if (this.registerdto.Address.length - 1 > -1) {

          //     this.btndisable = "line_btn sblue";
          //   }
          //   else if (this.registerdto.Address.length == 0) {
          //     this.btndisable = "disable";
          //   }
          //   else {
          //     this.btndisable = "disable";
          //   }

          // }
          this.btndisable = "line_btn sblue";
        }
        else if (this.registerdto.City.length == 0) {
          this.btndisable = "disable";
        }
      }
      else {
        this.btndisable = "disable";
      }

    }
    else {
      this.btndisable = "disable";
    }
  }
  contactformvalidate() {
    console.log("dsfhsdkjfhskjdhfskdjfh shjdfhskdjfhk kjsdfhksjdh");
    if (this.registerdto.Mobile != null) {
      if (this.registerdto.Mobile.length >= 7 && this.registerdto.Mobile.length <= 10) {
        // this._timeout = window.setTimeout(() => {
        //   this._timeout = null;


        // }, 500);
        this.ProgressSpinnerDlg = true;
        this.userservice.MobileVerification(this.registerdto).subscribe(res => {
          this.ProgressSpinnerDlg = false;
          if (res["result"] === "Mobile is already registered") {
            this.btndisable = "disable";
            this.phonevaliderrormsg = "Mobile is already registered";
          }
          else {
            if (this.registerdto.Country == "5") {
              this.submitbtntext = "Verify";
              this.ConvertingFormToDto();
              this.ProgressSpinnerDlg = true;
              this.mobileotp.mobile = this.registerdto.Mobile;
              this.mobileotp.mobilewithcountrycode = this.selectedcountrycode + this.registerdto.Mobile;
                    
              this.userservice.MobileOTPAuthentication(this.mobileotp).subscribe(res => {
                console.log(res);
                this.otpresponse = res["result"];
                this.registerdto.OTP = res["otp"];
                this.PhoneOtp = res["otp"];
                this.ProgressSpinnerDlg = false;

                if (this.ruleschecked === true) {
                  this.btndisable = "line_btn sblue";
                  this.phonevaliderrormsg = "";
                }
                else {
                  this.btndisable = "disable";
                  this.phonevaliderrormsg = "Please read and agree terms and conditions";
                }

              },
                error => {
                  this.ProgressSpinnerDlg = false;
                  this.btndisable = "disable";
                  this.phonevaliderrormsg = error["error"]["result"];
                });
            }
            else {
            }
          }
        });

      }
      else if (this.registerdto.Mobile.length == 0) {
        this.btndisable = "disable";
        this.phonevaliderrormsg = "Please enter mobile number";
      }
      else if (this.registerdto.Mobile.length < 7) {
        this.btndisable = "disable";
        this.phonevaliderrormsg = "Please enter a valid mobile number";
      }
    }
    else {
      this.btndisable = "disable";
    }
  }



  otpformvalidate() {
    this.otpdisable = false;
    this.localStorage.remove('mtimerdata');
    this.timerdata = this.localStorage.get('timerdata');
    if (this.Otp != null) {

      if (this.Otp.toString().length == 6) {
        this.otpnumb = "numb";

        if (this.timerdata < "02:00") {

          if (this.Otp == this.registerdto.OTP.toString()) {

            this.btndisable = "line_btn sblue";
            this.btnotpdis = "disabled";
            this.timerbtndisplay = true;
            this.verifybtndisplay = false;
            this.callDuration = "";
            this.otpdisable = true;
            this.subscription.unsubscribe();
          }
          else {
            this.otpresponse = "Invalid OTP";
            this.responsesty = "otperrormsg";
            this.btndisable = "disable";
          }
        }
        else {
          this.otpresponse = "Please enter OTP with in 2 minutes";
          this.responsesty = "otperrormsg";
          this.btndisable = "disable";
          this.btnotpdis = "line_btn sblue";
          this.timerbtndisplay = true;
          this.verifybtndisplay = false;
          this.resendtext = 'Resend in 00:00';
          this.callDuration = "";
          this.Otp = "";
        }
      }
      else if (this.Otp.toString().length == 0) {
        this.btndisable = "disable";
        this.otpnumb = "";
        this.otpresponse = "";
      }
      else if (this.Otp.toString().length <= 5) {
        this.otpnumb = "";
        this.btndisable = "disable";
        this.otpresponse = "";
      }

      else {
        this.otpresponse = "";
        this.btndisable = "disable";
      }

    }
    else {
      this.otpresponse = "";
      this.btndisable = "disable";
    }
  }

  Motpformvalidate() {
    this.timerdata = this.localStorage.get('mtimerdata');
    if (this.MOtp != null) {

      if (this.MOtp.toString().length == 6) {
        this.otpnumb = "numb";

        if (this.timerdata < "02:00") {

          if (this.MOtp == this.registerdto.OTP.toString()) {

            this.btndisable = "line_btn sblue";
            this.mbtnotpdis = "disabled";
            this.mobiletimerbtndisplay = true;
            this.verifybtndisplay = false;
            this.callDuration = "";
            this.otpdisable = true;

          }
          else {
            this.otpresponse = "Invalid OTP";
            this.responsesty = "otperrormsg";
            this.btndisable = "disable";
          }
        }
        else {
          this.otpresponse = "Please enter OTP with in 2 minutes";
          this.responsesty = "otperrormsg";
          this.btndisable = "disable";
          this.mbtnotpdis = "line_btn sblue";
          this.mobiletimerbtndisplay = true;
          this.verifybtndisplay = false;
          this.resendtext = 'Resend in 00:00';
          this.callDuration = "";
          this.MOtp = "";
        }
      }
      else if (this.MOtp.toString().length == 0) {
        this.btndisable = "disable";
        this.otpnumb = "";
        this.otpresponse = "";
      }
      else if (this.MOtp.toString().length <= 5) {
        this.otpnumb = "";
        this.btndisable = "disable";
        this.otpresponse = "";
      }

      else {
        this.otpresponse = "";
        this.btndisable = "disable";
      }

    }
    else {
      this.otpresponse = "";
      this.btndisable = "disable";
    }
  }

  prevclick() {

    const slides = document.getElementsByTagName('li');
    let i = 0;
    for (i = 0; i < slides.length; i++) {
      if (slides[i].getAttribute('class') === 'active') {
        this.currentIndex = slides[i].getAttribute('data-slide-to');
        if (parseInt(this.currentIndex) == 1) {
          this.prevbtn = "none";
          this.topheader = "";
          this.response = "";
        }
        else {
          this.prevbtn = "backBtn";
        }

        if (parseInt(this.currentIndex) == 4) {
          this.resetTimer = true;
          this.timerbtndisplay = true;
          this.mobiletimerbtndisplay = true;
          this.verifybtndisplay = false;
          this.submitbtntext = "Verify";
        }
        if (parseInt(this.currentIndex) <= 3) {
          this.submitbtntext = "Next";
        }
      }

    }
    this.basicformvalidate();
  }
  GetCountriesList() {
    this.userservice.GetCountriesList().subscribe(res => {
      this.selectedcountrycode = res[0]["mobilecode"];
      Object.keys(res).map(key => (
        this.countries.push({ label: res[key]["description"], value: res[key]["id"], mobilecode: res[key]["mobilecode"] })
      ));
    });
  }

  ConvertingFormToDto() {

    this.registerdto.FirstName = this.registrationForm.value["firstname"];
    this.registerdto.LastName = this.registrationForm.value["lastname"];
    this.registerdto.Mobile = this.registrationForm.value["mobile"];
    this.registerdto.Email = this.registrationForm.value["emailid"];
    this.registerdto.Address = this.registrationForm.value["address"];
    this.registerdto.City = this.registrationForm.value["city"];
    this.registerdto.PWD = this.registrationForm.value["password"];
    this.registerdto.Image = this.finalImage.replace(/^data:image\/[a-z]+;base64,/, "");
    this.registerdto.LoginType = "D";
  }

  CheckEmail(): any {
    this.ProgressSpinnerDlg = true;
    //this.registerdto.Email="swathi.chinnala@gmail.com";
    this.ConvertingFormToDto();
    if (this.registerdto.Email != null) {
      if (this.registerdto.Email.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)) {
        this.userservice.EmailVerification(this.registerdto).subscribe(res => {
          if (res["result"] === "Email is valid") {
            this.response = "";
            //this.HideResponse();
            this.responsesty = "succsmsg";
            this.btndisable = "line_btn sblue";
            this.ProgressSpinnerDlg = false;

          }
          else if (res["result"] === "Email Id already registered") {

            this.response = "Email is already registered";

            this.responsesty = "errormsg";

            this.btndisable = "disable";
            this.ProgressSpinnerDlg = false;

          }
        },
          errormsg => {
            this.response = errormsg["error"]["result"];
            this.responsesty = "errormsg";

            this.btndisable = "disable";
            this.ProgressSpinnerDlg = false;

          });
      }
    }
  }

  addcustomer() {

    const slides = document.getElementsByTagName('li');
    let i = 0;
    for (i = 0; i < slides.length; i++) {
      if (slides[i].getAttribute('class') === 'active') {
        this.currentIndex = slides[i].getAttribute('data-slide-to');
        if (parseInt(this.currentIndex) >= 0) {

          this.prevbtn = "backBtn";
          this.topheader = "_top";
        }
        if (parseInt(this.currentIndex) != 6) {

          if (parseInt(this.currentIndex) == 0) {
            setTimeout(() => {
              document.getElementById('emailid').focus();

            }, 0);
            this.formauthdatavalidate();

            this.registrationForm.controls['country'].setValue(this.countries[0].value, { onlySelf: true });

          }
          else if (parseInt(this.currentIndex) == 1) {

            this.Addressformvalidate();

          }
          else if (parseInt(this.currentIndex) == 2) {
            setTimeout(() => {
              document.getElementById('mobile').focus();

            }, 0);
            this.submitbtntext = "Verify";
            this.contactformvalidate();
            this.registerdto.Country = this.registrationForm.value["country"];

          }

          else if (parseInt(this.currentIndex) == 3) {
            if (this.registerdto.Country == "5") {
              this.verifybtndisplay = true;
              this.submitbtntext = "Verify";

              this.mobiletimerbtndisplay = false;
              this.otpresponse="Check your registered Mobile for One-Time-Password(OTP) and enter the code here";
              this.responsesty = "otpsuccsmsg";
              this.callDuration = this.elementRef.nativeElement.querySelector('#mtime');
              this.MobilestartTimer(this.callDuration);


              //  this.ConvertingFormToDto();
              // this.ProgressSpinnerDlg = true;
              // this.mobileotp.mobile = this.registerdto.Mobile;
              // this.mobileotp.mobilewithcountrycode = this.selectedcountrycode;

              // this.userservice.MobileOTPAuthentication(this.mobileotp).subscribe(res => {
              //   this.mobiletimerbtndisplay = false;
              //   this.otpresponse = res["result"];
              //   this.responsesty = "otpsuccsmsg";
              //   this.registerdto.OTP = res["otp"];
              //   this.PhoneOtp = res["otp"];
              //   this.callDuration = this.elementRef.nativeElement.querySelector('#mtime');
              //   this.MobilestartTimer(this.callDuration);
              //   this.ProgressSpinnerDlg = false;
              // },
              //   error => {
              //     this.verifybtndisplay = false;

              //     this.otpresponse = error["error"]["result"];
              //     this.responsesty = "otperrormsg";
              //     this.ProgressSpinnerDlg = false;
              //   });

              //this.prevbtn = "none";
              //this.topheader = "none";
              this.Motpformvalidate();
            }
            else {

              this.Emailotpsent();
            }
          }

          else if (parseInt(this.currentIndex) == 4) {
            if (this.registerdto.Country == "5") {
              this.Emailotpsent();
            }
            else {
              this.InsertCustomer();
            }
          }

          else if (parseInt(this.currentIndex) == 5) {
            if (this.registerdto.Country == "5") {
              this.InsertCustomer();
            }
            else {
            }
          }
          else if (parseInt(this.currentIndex) == 6) {
          }
        }
      }
    }
  }

  resendotp() {
    this.ProgressSpinnerDlg = true;
    this.btndisable = "disable";
    this.userservice.sendingotp(this.registerdto).subscribe(res => {
      this.ProgressSpinnerDlg = false;
      this.btndisable = "disable";
      this.submitbtntext = "verify";
      this.verifybtndisplay = false;
      this.timerbtndisplay = true;
      this.otpresponse = res["result"];
      this.responsesty = "otpsuccsmsg";
      this.HideResponse();
      this.EmailOtp = res["otp"];
      this.registerdto.OTP = res["otp"];
      this.localStorage.set('otp', res["otp"]);
      this.callDuration = this.elementRef.nativeElement.querySelector('#time');
      this.startTimer(this.callDuration);

      this.timerbtndisplay = false;
      this.verifybtndisplay = true;
      this.btnotpdis = "disable";
      this.resendtext = "Resend";
      this.otpdisable = false;

    },
      errormsg => {
        this.verifybtndisplay = true;
        this.timerbtndisplay = false;
        this.response = errormsg["error"]["result"];
        this.responsesty = "errormsg";
      });
  }
  mobileresendotp() {
    this.registerdto.OTP = 0;
    this.mobileotp.mobile = this.registerdto.Mobile;
    this.mobileotp.mobilewithcountrycode = this.selectedcountrycode + this.registerdto.Mobile;
    this.ProgressSpinnerDlg = true;
    this.btndisable = "disable";
    this.userservice.MobileOTPAuthentication(this.mobileotp).subscribe(res => {
      this.ProgressSpinnerDlg = false;
      this.btndisable = "disable";
      this.submitbtntext = "verify";
      this.verifybtndisplay = false;
      this.mobiletimerbtndisplay = true;
      this.otpresponse = res["result"];
      this.responsesty = "otpsuccsmsg";
      this.HideResponse();

      this.registerdto.OTP = res["otp"];
      this.PhoneOtp = res["otp"];
      this.localStorage.set('motp', res["otp"]);
      this.callDuration = this.elementRef.nativeElement.querySelector('#mtime');
      this.MobilestartTimer(this.callDuration);

      this.mobiletimerbtndisplay = false;
      this.verifybtndisplay = true;
      this.mbtnotpdis = "disable";
      this.resendtext = "Resend";
      this.otpdisable = false;

    },
      errormsg => {
        this.verifybtndisplay = true;
        this.mobiletimerbtndisplay = false;
        this.response = errormsg["error"]["result"];
        this.responsesty = "errormsg";
      });
  }

  startTimer(display) {
    var timer = 120;
    var minutes;
    var seconds;
    this.resetTimer = false;
    this.subscription = Observable.interval(1000).subscribe(x => {
      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = "Resend in " + minutes + ":" + seconds;

      --timer;
      this.localStorage.remove('mtimerdata');
      this.localStorage.set('timerdata', minutes + ":" + seconds);

      if (this.resetTimer === true) {
        timer = 0;
      }

      if (minutes + ":" + seconds == "00:00") {
        if (this.resetTimer === true) {
          this.subscription.unsubscribe();
        } else {
          this.subscription.unsubscribe();
          this.btnotpdis = "line_btn sblue";
          this.otpresponse = "";
          this.Otp = "";
          //this.registerdto.OTP=0;
          display.textContent = "Resend";
          this.timerbtndisplay = false;
          this.verifybtndisplay = true;
          this.resendtext = 'Resend';
          this.localStorage.get('otp');
          this.callDuration = "";
          this.otpdisable = true;
        }
      }
    });

  }

  MobilestartTimer(display) {
    var timer = 120;
    var minutes;
    var seconds;
    this.resetTimer = false;
    this.mobilesubscription = Observable.interval(1000).subscribe(x => {
      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = "Resend in " + minutes + ":" + seconds;

      --timer;
      this.localStorage.set('mtimerdata', minutes + ":" + seconds);

      if (this.resetTimer === true) {
        timer = 0;
      }

      if (minutes + ":" + seconds == "00:00") {

        if (this.resetTimer === true) {
          this.subscription.unsubscribe();
        } else {
          this.mobilesubscription.unsubscribe();
          this.btnotpdis = "line_btn sblue";
          this.otpresponse = "";
          this.MOtp = "";
          //this.registerdto.OTP=0;
          display.textContent = "Resend";
          this.mobiletimerbtndisplay = false;
          this.verifybtndisplay = true;
          this.resendtext = 'Resend';
          this.localStorage.get('motp');
          this.callDuration = "";
          this.otpdisable = true;
        }
        this.mobilesubscription.unsubscribe();
        this.mbtnotpdis = "line_btn sblue";
        this.otpresponse = "";
        this.MOtp = "";
        //this.registerdto.OTP=0;
        display.textContent = "Resend";
        this.mobiletimerbtndisplay = false;
        this.verifybtndisplay = true;
        this.resendtext = 'Resend';
        this.localStorage.get('motp');
        this.callDuration = "";
        this.otpdisable = true;
      }
    });

  }

  ResetForm() {

    this.registrationForm.reset({
      'firstname': '',
      'lastname': '',
      'mobile': '',
      'emailid': '',
      'address': '',
      'country': 'Select Country',
      'city': '',
      'confirmpassword': '',
      'password': '',
    });
    this.finalImage = "";
  }

  showTermsDialog() {
    this.termesdialogdisplay = true;
  }

  ontemsDialogClose(event) {
    console.log("sdfhsgfshdfgshdf");
    if (this.termsNCond.isChecked === true) {
      this.ruleschecked = this.termsNCond.isChecked;
      this.IsAcceptterms(this.termsNCond.isChecked);
    }
    this.termesdialogdisplay = event;
  }

  HideResponse() {
    setTimeout(() => {
      this.response = "";
    }, 5000);
  }
  IsAcceptterms(event) {
    if (this.ruleschecked === true) {
      this.TermandCondition = "Y";
      if (this.phonevaliderrormsg != "Please read and agree terms and conditions" && this.phonevaliderrormsg.length>0) {
        this.contactformvalidate();
      }
      else {
        this.phonevaliderrormsg = "";
        this.btndisable = "line_btn sblue";
      }
    }
    else {
      this.btndisable = "disable";
      this.phonevaliderrormsg = "Please read and agree terms and conditions";
    }
  }

  public restrictNumeric(lastname, evt) {

    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (lastname.selectionStart || lastname.selectionStart == '0') {
      this.caretPos = lastname.selectionStart;

      if (this.caretPos == 0 && charCode == 32) {
        return false;
      }
    }
    //this.registerdto.LastName = lastname.value.trimLeft();

    if (typeof String.prototype.trim !== 'function') {
      String.prototype.trim = function () {
        return this.registerdto.LastName.replace(/^\s+|\s+$/g, '');
      }
    }
  }

  public firstrestrictNumeric(lastname, evt) {

    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (lastname.selectionStart || lastname.selectionStart == '0') {
      this.caretPos = lastname.selectionStart;

      if (this.caretPos == 0 && charCode == 32) {
        return false;
      }
    }
    // this.registerdto.FirstName = lastname.value.trimLeft();
    if (typeof String.prototype.trim !== 'function') {
      String.prototype.trim = function () {
        return this.registerdto.FirstName.replace(/^\s+|\s+$/g, '');
      }
    }
  }


  Login() {
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
          if (res["loginType"] == "C") {
            this.router.navigateByUrl("/customer/home");
            if (this.localStorage.get("merchanturl") != null) {
              window.open(this.localStorage.get("merchanturl"), "_blank");
              this.localStorage.remove("merchanturl");
            }
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
            this.localStorage.remove('mtimerdata');
            sessionStorage.clear();
          }
        }
      }
    },
      errormsg => {
        this.ProgressSpinnerDlg = false;
      });
  }
  selectedcountry(event) {
    this.countries.forEach(x => {
      if (x["value"] == event.value) {
        this.selectedcountrycode = x["mobilecode"];
      }
    });
  }


  Emailotpsent() {
    this.mobiletimerbtndisplay = true;
    if (this.registerdto.Country == "5") {
      this.mobilesubscription.unsubscribe();
    }
    this.localStorage.remove('mtimerdata');
    this.registerdto.OTP = 0;
    this.verifybtndisplay = true;
    // this.submitbtntext = "Confirm";
    this.submitbtntext = "Verify";
    this.ConvertingFormToDto();
    this.ProgressSpinnerDlg = true;

    this.userservice.SendOTP(this.registerdto).subscribe(res => {

      // this.ProgressSpinnerDlg = false; 
      this.timerbtndisplay = false;
      this.otpresponse = res["result"];
      this.responsesty = "otpsuccsmsg";
      //this.HideResponse();
      this.registerdto.OTP = res["otp"];
      this.EmailOtp = res["otp"];
      this.callDuration = this.elementRef.nativeElement.querySelector('#time');
      this.startTimer(this.callDuration);
      this.ProgressSpinnerDlg = false;
    },
      error => {

        this.otpresponse = error["result"];
        this.responsesty = "otperrormsg";

      });
    //this.prevbtn = "none";
    //this.topheader = "none";
    this.otpformvalidate();
  }

  InsertCustomer() {
    this.hidenextbtn = true;
    this.prevbtn = "none";
    this.topheader = "none";

    this.registerdto.Address = this.registerdto.Address == null ? " " : this.registerdto.Address.trim();
    this.addregisterdto.FirstName = this.registerdto.FirstName;
    this.addregisterdto.LastName = this.registerdto.LastName;
    this.addregisterdto.Email = this.registerdto.Email;
    this.addregisterdto.Country = this.registerdto.Country.toString();
    this.addregisterdto.City = this.registerdto.City;
    this.addregisterdto.LoginType = this.registerdto.LoginType;
    this.addregisterdto.Mobile = this.registerdto.Mobile;
    this.addregisterdto.PWD = this.registerdto.PWD;
    this.addregisterdto.Address = this.registerdto.Address;
    this.addregisterdto.TermandCondition = this.TermandCondition;
    this.addregisterdto.OTP = this.EmailOtp;
    this.addregisterdto.mobileOTP = this.PhoneOtp;

    this.userservice.InsertCustomer(this.addregisterdto).subscribe(res => {

      this.userPostData.Email = this.addregisterdto.Email;
      this.userPostData.PWD = this.addregisterdto.PWD;
      this.Login();
      this.response = res["result"];
      this.responsesty = "succsmsg";
      this.userdata = res['reFirstName'];

      // this.localStorage.set('Email', res['reEmail']);
      // this.localStorage.set('loginType', res["loginType"]);
      this.Otp = "";

      // this.router.navigateByUrl("/customer/home");
    });
  }

  restrictInput(event: any) {
    const pattern = /[a-zA-Z]/;
    if (!pattern.test(event.key)) {
      event.srcElement.value = (event.srcElement.value).substr(0, (event.srcElement.value).length - 1);
    }
  }

}