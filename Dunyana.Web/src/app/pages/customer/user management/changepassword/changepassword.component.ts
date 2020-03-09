import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChangepasswordDto } from '../../model/DTOs/ChangepasswordDto';
import { UsermanagementService } from '../../services/usermanagement.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/shared/validators/PasswordMustMatchvalidator';
import { LocalStorageService } from 'angular-web-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationDto } from '../../model/DTOs/RegistraionDto';
import { AuthGuard } from 'src/app/shared/auth//_guards';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  @Input() display: boolean;
  @Output() displayChange = new EventEmitter();
  ProgressSpinnerDlg: boolean = false;
  changepwdForm: FormGroup;
  btndisable: string = "disable";
  response: string = "";
  responsesty: string = "";
  oldpwdmsg: string = "";
  disabled: string = "";
  pwdvaliderrormsg: string = "";
  cpwdvaliderrormsg: string = "";
  passwordpattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_])[A-Za-z\d@$!_]{8,}$';
  oshow: boolean;
  nshow: boolean;
  cshow: boolean;

  changepassword: ChangepasswordDto = {
    confirmpassword: null,
    PWD: null,
    NPWD: null
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

  constructor(private userservice: UsermanagementService, private formBuilder: FormBuilder,
    private localStorage: LocalStorageService,
    public router: Router,
    private authgurd: AuthGuard, private activate: ActivatedRoute, ) { }

  ngOnInit() {
    this.oshow = false;
    this.nshow = false;
    this.cshow = false;


    this.changepwdForm = this.formBuilder.group({
      PWD: ['', [Validators.required]],
      NPWD: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_])[A-Za-z\d@$!_]{8,}$/)]],
      confirmpassword: ['', Validators.required]
    },
      {
        validator: MustMatch('NPWD', 'confirmpassword')
      });
  }

  SaveChangePassword() {
    if (this.authgurd.canActivate(this.activate.snapshot, this.router.routerState.snapshot)) {
      this.registerdto.Email = this.localStorage.get("Email");
      this.ProgressSpinnerDlg = true;
      this.registerdto.PWD = this.changepwdForm.value["NPWD"];
      this.registerdto.oldPWD = this.changepwdForm.value["PWD"];
      this.userservice.ChangePassword(this.registerdto).subscribe(res => {
        this.ProgressSpinnerDlg = false;
        this.FormReset();
        this.response = res["result"];
        this.responsesty = "succsmsg";
        this.btndisable = "disable";
        setTimeout(() => {
          this.btndisable = "";
          this.onClose();
          this.localStorage.remove("username");
          this.localStorage.remove("Email");
          this.localStorage.remove("customerid");
          this.localStorage.remove("otp");
          this.localStorage.remove("PWD");
          this.localStorage.remove("loginType");
          this.localStorage.remove("timerData");
          this.router.navigateByUrl("signin");
        }, 1000);

      },
        errormsg => {
          this.response = errormsg["error"]["result"];
          this.responsesty = "errormsg";
          this.ProgressSpinnerDlg = false;

        });
    }
  }

  checkoldpwd() {

    setTimeout(() => {
      let oldpwd = this.localStorage.get("PWD");

      if (this.changepassword.PWD != null) {
        if (this.changepassword.PWD.length >= 0) {
          if (this.changepassword.PWD === oldpwd) {
            this.changepwdForm.controls['NPWD'].enable();
            this.changepwdForm.controls['confirmpassword'].enable();
            this.response = "";
            this.pwdmatch();

          }
          else if (this.changepassword.PWD.length == 0) {
            this.response = "";
            this.changepwdForm.controls['NPWD'].disable();
            this.changepwdForm.controls['confirmpassword'].disable();
            this.btndisable = "disable";
          }
          else {
            this.btndisable = "disable";
            this.response = "Wrong old Password";
            this.responsesty = "errormsg";
            this.changepwdForm.controls['NPWD'].disable();
            this.changepwdForm.controls['confirmpassword'].disable();

          }
        }
        else {
          this.changepwdForm.controls['NPWD'].disable();
          this.changepwdForm.controls['confirmpassword'].disable();
          this.response = "";
        }
      }
      else {
        this.changepwdForm.controls['NPWD'].disable();
        this.changepwdForm.controls['confirmpassword'].disable();
        this.response = "";
        this.btndisable = "disable";
      }

    }, 1000);
  }

  validatepwd() {
    if (this.changepassword.NPWD != null) {
      if (this.changepassword.NPWD.length > 0) {
        if (!this.changepassword.NPWD.match(this.passwordpattern)) {
          this.pwdvaliderrormsg = "The password length must be 8 to 12 characters and it should contain at least 1 uppercase,1 lowercase, 1 special character($,@,!,_) and 1 numeric.";
          this.responsesty = "errormsg";
          this.btndisable = "disable";
        }

        else {
          this.pwdmatch();
          this.pwdvaliderrormsg = "";
          this.responsesty = "";
          this.response = "";
        }
      }
      else {
        this.pwdvaliderrormsg = "";
        this.responsesty = "";
        this.response = "";
        this.btndisable = "disable";
      }

    }
    else {
      this.response = "";
      this.btndisable = "disable";
    }
  }
  pwdmatch() {
    if (this.changepassword.confirmpassword != null) {
      if (this.changepassword.confirmpassword.length > 0) {
        if (this.changepassword.confirmpassword == this.changepassword.NPWD) {
          if (this.changepassword.NPWD.match(this.passwordpattern)) {
            this.cpwdvaliderrormsg = "";
            this.responsesty = "";
            this.response = "";
            this.btndisable = "line_btn sblue mr-4";
          }
          else {
            this.cpwdvaliderrormsg = "";
          }
        }
        else {
          this.cpwdvaliderrormsg = "Confirm password must match password";
          this.responsesty = "errormsg";
          this.btndisable = "disable";
        }
      }
      else {
        this.cpwdvaliderrormsg = "";
        this.responsesty = "";
        this.response = "";
        this.btndisable = "disable";
      }
    }
    else {
      this.btndisable = "disable";
    }
  }
  onClose() {
    this.displayChange.emit(false);
    this.FormReset();
  }
  redirectCustomer() {
    this.displayChange.emit(false);
    this.FormReset();
  }
  FormReset() {
    this.changepwdForm.reset({
      'PWD': '',
      'NPWD': '',
      'confirmpassword': ''
    });
    this.response = "";
    this.cpwdvaliderrormsg = "";
    this.pwdvaliderrormsg = "";
  }

  password(type) {
    if (type === 'o') {
      this.oshow = !this.oshow;
    }
    else if (type === 'n') {
      this.nshow = !this.nshow;
    }
    else if (type === 'c') {
      this.cshow = !this.cshow;
    }
  }
}
