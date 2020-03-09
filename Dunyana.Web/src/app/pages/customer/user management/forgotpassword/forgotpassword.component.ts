import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { RegistrationDto } from '../../model/DTOs/RegistraionDto';
import { UsermanagementService } from '../../services/usermanagement.service';
import { MessageService } from 'primeng/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'angular-web-storage';
import { Observable, Subscription } from 'rxjs/Rx';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  lang = 'en';

  headerlogo: string = "assets/layout/images/glogo.png";
  checkinfo: string = "assets/layout/images/svg/success.svg";
  ProgressSpinnerDlg: boolean = false;
  @ViewChild('div') div: ElementRef;
  public show = false;
  forgotform: FormGroup;
  FirstregistrationForm: FormGroup;
  submitted = false;
  countries: any[] = [];
  default: string = 'United States';
  btndisable: string = "disable";
  btnotpdis: string = "disable";
  currentIndex: string;
  hidenextbtn: boolean = false;
  flag: boolean = false;
  otp: string = "";
  activetab: string = "active";
  submitbtntext: string = "Submit";
  headertext: string = "Forgot Your Password";
  timerbtntext: string = "Resend in";
  prevbtn: string = "none";
  isprevbtn:boolean=false;
  timerbtndisplay: boolean = true;
  verifybtndisplay: boolean = false;
  callDuration: string = '';
  resendtext: string = 'Resend ';
  timetaken: any = '';
  timerdata: any = '';
  otpnumb: string = "";

  imageChangedEvent: any = '';
  croppedImage: any = '';
  finalImage: any = '';
  display: boolean = false;
  termesdialogdisplay: boolean = false;
  apiotp: any = '';
  EmailOTP: string = '';
  errmsg: string = '';
  otpdisable: boolean = false;
  timeLeft: number = 10;

  subscribeTimer: any;

  txtErrormsg: boolean = true;
  emailValiderrormsg: string = "";
  pwdValiderrormsg: string = "";
  smsmsg: string = '';
  passwordpattern: string = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!_@$]).{8,}$';
  emailPattern: string = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{1,}[.]{1}[a-zA-Z]{2,}';
  private subscription: Subscription;

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
    PWD: null,
    oldPWD: null,
    Type: null,
    EmailVerified: 0,
    Status: 0,
    OTP: 0
  }

  responsesty: string = "";
  response: string;
  constructor(private formBuilder: FormBuilder, private userservice: UsermanagementService,
    private messageService: MessageService, private ngxService: NgxUiLoaderService,
    public translate: TranslateService, private localStorage: LocalStorageService,
    private router: Router, private elementRef: ElementRef) {

  }

  ngOnInit() {
    if (this.localStorage.get('lang') != null) {
      this.lang = this.localStorage.get('lang');
      this.translate.use(this.lang);
    }
    else {
      this.translate.use(this.lang);
    }

    this.forgotform = this.formBuilder.group({
      emailid: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_])[A-Za-z\d@$!_]{8,}$ /), Validators.minLength(6)]],

      otp: ['', [Validators.required]]
    });
    this.apiotp = this.localStorage.get('otp');
    this.ProgressSpinnerDlg = false;

    this.timerbtndisplay = true;
    this.verifybtndisplay = false;
  }


  _keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  formvalidate() {
    if (this.forgotform.valid) {
      this.btndisable = "line_btn sblue";
    }
    else {
      this.btndisable = "disable";
    }
  }


  formauthdatavalidate() {

    if (this.registerdto.Email != null) {
      if (this.registerdto.Email.length > 0) {
        if (this.registerdto.Email.match(this.emailPattern)) {
          this.CheckEmail();

          this.smsmsg = this.localStorage.get('sms');
          this.txtErrormsg = true;
          this.emailValiderrormsg = "";

          if (this.smsmsg === "Email Id already registered") {
            this.btndisable = "line_btn sblue";
            this.show = true;
          }
        } else {
          this.txtErrormsg = false;
          this.emailValiderrormsg = "Please enter valid email";
          this.btndisable = "disable";
          this.show = true;
        }
      }
      else {
        this.txtErrormsg = false;
        this.div.nativeElement.innerHTML = "";
        this.emailValiderrormsg = "Please enter email";
        this.btndisable = "disable";
        this.show = true;
      }
    }
    else {
      this.emailValiderrormsg = "";
    }
  }


  pwdauthdatavalidate() {

    if (this.registerdto.PWD != null) {


      if (this.registerdto.PWD.length >= 8) {
        if (this.registerdto.PWD.match(this.passwordpattern)) {
          this.txtErrormsg = true;
          this.pwdValiderrormsg = "";
        }
        else {

          this.btndisable = "disable";
          this.txtErrormsg = false;
          this.pwdValiderrormsg = "The password length must be 8 to 12 characters and it should contain at least 1 uppercase,1 lowercase, 1 special character($,@,!,_) and 1 numeric.";
          this.div.nativeElement.innerHTML = "";
        }
      }

      else if (this.registerdto.PWD.length === 0) {
        this.txtErrormsg = false;
        this.pwdValiderrormsg = "";
        this.btndisable = "disable";
      }
      else if ((this.registerdto.PWD.length < 12) && (this.registerdto.PWD.length > 0)) {
        this.btndisable = "disable";
        this.txtErrormsg = false;
        this.pwdValiderrormsg = "The password length must be 8 to 12 characters and it should contain at least 1 uppercase,1 lowercase, 1 special character($,@,!,_) and 1 numeric.";
        this.div.nativeElement.innerHTML = "";
      }
    } else if (this.registerdto.PWD === "") {
      this.btndisable = "disable";
      this.txtErrormsg = false;
      this.pwdValiderrormsg = "";
    }

    else if (this.registerdto.PWD === null) {
      this.btndisable = "disable";
      this.txtErrormsg = false;
      this.pwdValiderrormsg = "";
    }
  }

  otpformvalidate() {

    this.show = true;
    this.timerdata = this.localStorage.get('timerdata');
    this.EmailOTP = this.forgotform.value["otp"];
    if (this.EmailOTP != null) {
      if (this.EmailOTP.toString().length == 6) {

        if (this.timerdata < "02:00") {

          if (this.EmailOTP == this.registerdto.OTP.toString()) {
            this.btndisable = "line_btn sblue";
            this.btnotpdis = "disabled";

            this.div.nativeElement.innerHTML = " ";
            this.timerbtndisplay = true;
            this.verifybtndisplay = false;
            this.callDuration = "";
            this.otpdisable = true;

          }
          else {
            this.btndisable = "disable";
            this.show = false;
            this.div.nativeElement.innerHTML = "Invalid OTP";
            this.responsesty = "errormsg";
          }
        }
        else {

          this.btndisable = "disable";
          this.btnotpdis = "line_btn sblue";
          this.show = false;
          this.div.nativeElement.innerHTML = "Please enter OTP with in 2 minutes";
          this.timerbtndisplay = true;
          this.verifybtndisplay = false;
          this.resendtext = 'Resend';
          this.localStorage.remove("username");
          this.localStorage.remove("Email");
          this.localStorage.remove("customerid");
          this.localStorage.remove("otp");
          this.localStorage.remove("PWD");
          this.localStorage.remove("loginType");
          this.localStorage.remove("timerData");
          this.callDuration = "";
          this.subscription.unsubscribe();
        }
      }
      else if (this.EmailOTP.toString().length == 0) {
        this.div.nativeElement.innerHTML = "";
        this.btndisable = "disable";
        this.callDuration = "";
      }
      else if (this.EmailOTP.toString().length <= 5) {
        this.div.nativeElement.innerHTML = "";
        this.btndisable = "disable";
        this.responsesty = "errormsg";
        this.callDuration = "";
      }
      else if (this.EmailOTP.toString().length == 6) {
        this.div.nativeElement.innerHTML = "Invalid OTP";
        this.btndisable = "disable";
        this.responsesty = "errormsg";
        this.callDuration = "";
      }
      else {
        this.div.nativeElement.innerHTML = "";
        this.btndisable = "disable";
      }
    }
    else {
      this.div.nativeElement.innerHTML = "";
      this.btndisable = "disable";
    }

  }

  ConvertingFormToDto() {
    this.registerdto.Email = this.forgotform.value["emailid"];
    this.registerdto.PWD = this.forgotform.value["password"];
  }

  converingFormvalue() {
    this.registerdto.PWD = this.forgotform.value["password"];
    this.registerdto.Email = this.forgotform.value["emailid"];
  }

  CheckEmail() {
    this.ConvertingFormToDto();
    if (this.registerdto.Email.match(this.emailPattern)) {

      this.ProgressSpinnerDlg = true;
      this.userservice.EmailVerification(this.registerdto).subscribe(res => {
        this.ProgressSpinnerDlg = false;

        if (res["result"] == "Email is valid") {

          this.show = false;
          this.div.nativeElement.innerHTML = "Email does not exist";
          this.responsesty = "errormsg";
          this.localStorage.remove("username");
          this.localStorage.remove("Email");
          this.localStorage.remove("customerid");
          this.localStorage.remove("otp");
          this.localStorage.remove("PWD");
          this.localStorage.remove("loginType");
          this.localStorage.remove("timerData");
          this.localStorage.set('sms', res["result"]);
          this.btndisable = "disable";

        }
        else if (res["result"] === "Email Id already registered") {
          this.btndisable = "line_btn sblue";
          this.div.nativeElement.innerHTML = "";
          this.localStorage.remove("username");
          this.localStorage.remove("Email");
          this.localStorage.remove("customerid");
          this.localStorage.remove("otp");
          this.localStorage.remove("PWD");
          this.localStorage.remove("loginType");
          this.localStorage.remove("timerData");
          this.localStorage.set('sms', res["result"]);
        }
      },
        errormsg => {
          this.show = false;
          this.div.nativeElement.innerHTML = errormsg["result"];
        });
    }
  }

  submitforgotdata() {
    const slides = document.getElementsByTagName('li');
    let i = 0;
    for (i = 0; i < slides.length; i++) {
      if (slides[i].getAttribute('class') === 'active') {
        this.currentIndex = slides[i].getAttribute('data-slide-to');

        if (parseInt(this.currentIndex) != 3) {

          if (parseInt(this.currentIndex) == 0) {
                 this.isprevbtn=true;
            this.sendotp();

            this.submitbtntext = "Verify";
          }
          else if (parseInt(this.currentIndex) == 1) {

            this.btndisable = "disable";
            this.submitbtntext = "Submit";
            this.headertext = "Reset Password";
            this.timerbtndisplay = true;
            this.verifybtndisplay = false;
            this.subscription.unsubscribe();

          }
          else if (parseInt(this.currentIndex) == 2) {
            this.subscription.unsubscribe();
            this.submitbtntext = "Submit";
            this.headertext = "welcome back";
            this.btndisable = "none";
            this.show = true;
            this.hidenextbtn = true;
            this.timerbtndisplay = true;
            this.verifybtndisplay = false;
            this.updatenewpwd();
          }
        }

      }
    }
    this.ConvertingFormToDto();
  }
  onKeyPress(event: any) {

    this.show = true;
  }

  ResetForm() {

    this.forgotform.reset({
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
    this.termesdialogdisplay = event;
  }

  sendotp() {

    this.ProgressSpinnerDlg = true;
    this.btndisable = "disable";
    this.userservice.sendingotp(this.registerdto).subscribe(res => {
      this.ProgressSpinnerDlg = false;

      this.btnotpdis = "disable";
      this.submitbtntext = "Verify";

      this.show = false;
      this.div.nativeElement.innerHTML = res["result"];
      this.responsesty = "succsmsg";
      this.HideResponse();
      this.headertext = "Verify Email";

      this.registerdto.OTP = res["otp"];
      this.localStorage.set('otp', res["otp"]);
      this.callDuration = this.elementRef.nativeElement.querySelector('#time');
      this.startTimer(this.callDuration);

      this.timerbtndisplay = false;
      this.verifybtndisplay = true;

    },
      errormsg => {
        this.show = false;
        this.div.nativeElement.innerHTML = errormsg["error"]["result"];
      });
  }

  resendotp() {
    this.callDuration = "";
    this.ProgressSpinnerDlg = true;
    this.btndisable = "disable";
    this.userservice.sendingotp(this.registerdto).subscribe(res => {
      this.ProgressSpinnerDlg = false;
      this.btndisable = "disable";
      this.submitbtntext = "Verify";
      this.verifybtndisplay = false;
      this.timerbtndisplay = true;
      this.show = false;
      this.div.nativeElement.innerHTML = res["result"];
      this.responsesty = "succsmsg";
      this.headertext = "Verify Email";
      this.HideResponse();

      this.registerdto.OTP = res["otp"];
      this.localStorage.set('otp', res["otp"]);
      this.callDuration = this.elementRef.nativeElement.querySelector('#time');
      this.startTimer(this.callDuration);

      this.timerbtndisplay = false;
      this.verifybtndisplay = true;
      this.btnotpdis = "disable";
      this.otpdisable = false;
      this.resendtext = "Resend";
    },
      errormsg => {
        this.show = false;
        this.verifybtndisplay = true;
        this.timerbtndisplay = false;
        this.div.nativeElement.innerHTML = errormsg["error"]["result"];
      });
  }


  startTimer(display) {

    var timer = 120;
    var minutes;
    var seconds;
    this.subscription = Observable.interval(1000).subscribe(x => {
      minutes = Math.floor(timer / 60);
      seconds = Math.floor(timer % 60);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = "Resend in " + minutes + ":" + seconds;

      --timer;
      this.localStorage.set('timerdata', minutes + ":" + seconds);

      if (minutes + ":" + seconds == "00:00") {
        this.btnotpdis = "line_btn sblue";
        this.timerbtndisplay = false;
        this.verifybtndisplay = true;
        this.resendtext = 'Resend';
        display.textContent = "Resend";
        this.div.nativeElement.innerHTML = "";

        this.otp = "";
        this.callDuration = "";
        this.otpdisable = true;
        this.subscription.unsubscribe();

      }
    });

  }
  //Choose a password that is different from your last 3 passwords
  updatepwd() {
    this.ConvertingFormToDto();

    if (this.registerdto.PWD.match(this.passwordpattern)) {
      this.userservice.ChangePassword(this.registerdto).subscribe(res => {

        this.div.nativeElement.innerHTML = "";
        this.responsesty = "succsmsg";
        this.txtErrormsg = true;
        this.pwdValiderrormsg = "";
        this.btndisable = "line_btn sblue";

      },
        errormsg => {


          this.show = false;
          this.div.nativeElement.innerHTML = errormsg["error"]["result"];
          this.responsesty = "errormsg";
          this.pwdValiderrormsg = "";
          this.btndisable = "disable";

        });
    }
  }

  updatenewpwd() {
    this.ConvertingFormToDto();
    if (this.registerdto.PWD.match(this.passwordpattern)) {
      this.div.nativeElement.innerHTML = "Your password has been changed";
      this.responsesty = "succsmsg";
      setTimeout(() => {
        this.router.navigateByUrl('/signin');
      }, 1000);
    }
  }

  HideResponse() {
    setTimeout(() => {
      this.div.nativeElement.innerHTML = "";
    }, 5000);
  }

  prevclick()
  {
    this.router.navigateByUrl('/signin');
  }
}