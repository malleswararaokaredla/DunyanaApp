import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { merchentFormData, MerchantRegDto } from '../../modal/MerchantDto';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { MustMatch } from 'src/app/shared/validators/PasswordMustMatchvalidator';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MerchantService } from '../../services/merchant.service';
import { LocalStorageService } from 'angular-web-storage';
import { RegistrationDto } from '../../../customer/model/DTOs/RegistraionDto';
import { CategoryService } from 'src/app/pages/admin/services/category.service';
import { TermsConditionsComponent } from 'src/app/pages/customer/customerapp/About/terms-conditions/terms-conditions.component';

@Component({
  selector: 'app-merchantregistration',
  templateUrl: './merchantregistration.component.html',
  styleUrls: ['./merchantregistration.component.scss']
})



export class MerchantregistrationComponent implements OnInit {

  checkinfo: string = "assets/layout/images/svg/success.svg";
  btndisable: string = "disable";
  btnupload: string = "uploadimgsty uploadimgsty2";
  btnupload1: string = "uploadimgsty uploadimgsty1";
  headerlogo: string = "assets/layout/images/glogo.png";
  ProgressSpinnerDlg: boolean = false;
  merchantForm: FormGroup;
  verifybtndisplay: boolean = false;
  submitted = false;
  countries: any[] = [];
  categories: any[] = [];
  sellcountry: any[] = [];
  default: string = 'United States';
  popup: string = "";
  // popup:boolean=false;
  selectList: Array<any> = [];
  checkedlist: Array<any> = [];
  currentIndex: string;
  submitbtntext: string = "Next";
  imageChangedEvent: any = '';
  croppedImage: any = '';
  finalImage: any = '';
  prevbtn: string = "none";
  previosusbtn: boolean = true;
  iconimage: any = '';
  croppediconImage: any = '';
  TermandCondition: string = "";

  display: boolean = false;
  termesdialogdisplay: boolean = false;
  flage: boolean = true;
  filelength: string = '';
  checkimage: boolean = true;
  //couraselHref: string;
  caretPos: number = 0;

  @ViewChild('div') div: ElementRef;

  @ViewChild(TermsConditionsComponent)
  private termsNCond: TermsConditionsComponent;

  public show = false;
  removeicon: boolean = true;
  txtErrormsg: boolean = true;
  txtErrorresponse: string = "";
  nextslide: string = "next";
  namePattern: string = '^([A-Za-z0-9\&]+ )+[A-Za-z0-9\&]+$|^[A-Za-z0-9\&]+$';//'^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$'
  //namePattern:string='^[A-Za-z0-9]+(\s?[A-Za-z0-9]+\s*[&]?\s*)*([A-Za-z0-9]+)$';
  addressPattern: string = '^([A-Za-z0-9,-/]+ )+[A-Za-z0-9,-/]+$|^[A-Za-z0-9,-/]+$';
  passwordPattern: string = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!_@$]).{8,}$';
  //passwordPattern:string='^([A-Za-z0-9!@#$%^&*(),.?":{}]+ )+[A-Za-z0-9!@#$%^&*(),.?":{}]+$|^[A-Za-z0-9!@#$%^&*(),.?":{}]+$';//'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$';
  // emailPattern: string = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{1,}[.]{1}[a-zA-Z]{2,}';
  //emailPattern: string = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$";
  emailPattern: string = "/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i";

  webReg: string = '(https?://)?([\\da-zA-Z.-]+)\\.([a-zA-Z.]{2,6})[/\\w .-]*/?'//'(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  emailValiderrormsg: string = "";
  pwdValiderrormsg: string = "";
  websitevalidmsg: string = "";
  cpwdValiderrormsg: string = "";
  dropValiderromsg: string = "";
  chkValiderrormsg: string = "";
  merchentnameValidemsg: string = "";
  merchentCompanynameValidemsg: string = "";

  merwebsite: boolean = true;
  meremail: boolean = true;
  merpwdleter: boolean = true;
  merpwdlength: boolean = true;
  mercpwd: boolean = true;

  pmultiStyleSell: string = "";
  pdropStyle: string = "";
  pcheck: string = "";
  pmultiStyleCountry: string = "";
  Terms: boolean = false;
  _merchentFormData: merchentFormData = {
    Id: 0,
    Name: null,
    ProfileImage: null,
    Company: null,
    CompanyImage: null,
    Website: null,
    Country: null,
    Email: null,
    Categories: null,
    SellCountries: null,
    PWD: null,
    CPWD: null,
    TermandCondition: null,

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


  responsesty: string = '';
  smsmsg: string = '';
  hidenextbtn: boolean;
  topheader: string;
  fileSelected: boolean = true;
  checked: any;
  _timeout: any;
  constructor(private formBuilder: FormBuilder, private merchantservice: MerchantService,
    private localStorage: LocalStorageService, private categservice: CategoryService,
    private router: Router) { }

  showTermsDialog() {
    this.display = true;
  }
  onDialogClose(event) {
    if (this.termsNCond.isChecked === true) {
      this.Terms = this.termsNCond.isChecked;
      this.IsAcceptterms(this.termsNCond.isChecked);
    }
    this.display = event;
  }

  ngOnInit() {

    this.merchantForm = this.formBuilder.group({
      Name: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      Website: ['', [Validators.required, Validators.pattern(this.webReg)]],
      Company: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      Email: ['', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      country: ['Select Country', Validators.required],
      categorie: ['select categories', Validators.required],
      CompanyImage: ['', Validators.required],
      SellCountrie: ['', Validators.required],
      PWD: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_])[A-Za-z\d@$!_]{8,}$ /), Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_])[A-Za-z\d@$!_]{8,}$ /), Validators.minLength(6)]],
      TermandCondition: ['', Validators.required],
    },
      {
        validator: MustMatch('PWD', 'confirmpassword')
      }
    );

    this.countries.push({ label: 'Select Country*', value: '' });
    this.bindcountries();
    this.bindcategories();
    setTimeout(() => {
      document.getElementById('Name').focus();
    }, 0);
  }


  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  iconChangeEvent(event: any): void {

    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.finalImage = reader.result;
    this.removeicon = false;
    this.btnupload1 = "uploadimgsty";
    this.popup = "ht-auto";
  }


  fileChangeEvent(event: any): void {
    var files = event.srcElement.files;
    if (files.length > 0) {
      this.fileSelected = false;
      this.formvalidate();
    };
    var file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._cmpnyhandleReaderLoaded.bind(this);
    reader.readAsDataURL(file);


  }
  _cmpnyhandleReaderLoaded(e) {
    let reader = e.target;
    this.iconimage = reader.result;
    this.croppediconImage = reader.result;
    this.btnupload = "uploadimgsty";
    this.popup = "ht-auto";
    this.fileSelected = true;
    this.formvalidate();
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppediconImage = event.base64;

  }

  saveCropImage() {
    this.finalImage = this.croppedImage;
    this.removeicon = false;
    this.btnupload1 = "uploadimgsty";
    this.popup = "ht-auto";
  }

  saveiconCropImage() {
    this.fileSelected = true;
    this.iconimage = this.croppediconImage;
    this.btnupload = "uploadimgsty";
    this.popup = "ht-auto";

    this.formvalidate();
  }


  formvalidate() {

    this.btndisable = "disable";
    if (this._merchentFormData.Name != null) {

      if (this._merchentFormData.Name.match('^([A-Za-z0-9\&]+ )+[A-Za-z0-9\&]+$|^[A-Za-z0-9\&]+$')) {
        if ((this._merchentFormData.Name.length - 1 > -1)) {
          if (this._merchentFormData.Name.substring(0, 1) != "&") {
            this.merchentnameValidemsg = "";
            if (this._merchentFormData.Company != null) {

              if (this._merchentFormData.Company.match('^([A-Za-z0-9\&]+ )+[A-Za-z0-9\&]+$|^[A-Za-z0-9\&]+$')) {

                if (this._merchentFormData.Company.length - 1 > -1) {

                  if (this._merchentFormData.Company.substring(0, 1) != "&") {
                    this.merchentCompanynameValidemsg = "";
                    if (this.croppediconImage != "") {
                      this.btndisable = "line_btn sblue";
                      this.fileSelected = true;
                    }
                  } else {
                    this.merchentCompanynameValidemsg = "please enter valid company name";
                    this.txtErrormsg = false;
                  }
                }
                if (this._merchentFormData.Company.length == 0) {

                  this.btndisable = "disable";
                  this.txtErrormsg = true;

                }
              }
              else {
                this.btndisable = "disable";
                this.txtErrormsg = true;
              }

            }
            else {
              this.btndisable = "disable";
              this.txtErrormsg = true;
            }
          }
          else {
            this.merchentnameValidemsg = "please enter valid merchant name";
            this.txtErrormsg = false;
          }
        }
        else {
          this.btndisable = "disable";
          this.txtErrormsg = true;
        }
      }
      else {
        this.btndisable = "disable";
        this.txtErrormsg = true;
      }

    }
    else {
      this.btndisable = "disable";
      this.txtErrormsg = true;
    }
  }

  merchentFormvalidate() {
    if (this.merchantForm.valid) {
      this.btndisable = "line_btn sblue";
    }
    else {
      this.btndisable = "disable";
    }
  }

  CheckEmail() {
    this.btndisable = "disable";

    this.convertMailDto();
    if (this._merchentFormData.Email.length > 0) {
      if (this._merchentFormData.Email.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)) {
        this.ProgressSpinnerDlg = true;
        this.merchantservice.EmailVerification(this.registerdto).subscribe(res => {
          this.ProgressSpinnerDlg = false;
          if (res["result"] === "Email is valid") {
            this.localStorage.remove("username");
            this.localStorage.remove("Email");
            this.localStorage.remove("customerid");
            this.localStorage.remove("otp");
            this.localStorage.remove("PWD");
            this.localStorage.remove("loginType");
            this.localStorage.remove("timerData");
            this.localStorage.set('sms', res["result"]);
            this.show = true;
          }

          else if (res["result"] === "Email Id already registered") {
            this.localStorage.remove("username");
            this.localStorage.remove("Email");
            this.localStorage.remove("customerid");
            this.localStorage.remove("otp");
            this.localStorage.remove("PWD");
            this.localStorage.remove("loginType");
            this.localStorage.remove("timerData");
            this.localStorage.set('sms', res["result"]);
            this.responsesty = "errormsg";
            this.show = false;
            this.div.nativeElement.innerHTML = res["result"];
            this.btndisable = "disable";
          }
        },
          errormsg => {
            this.localStorage.remove("username");
            this.localStorage.remove("Email");
            this.localStorage.remove("customerid");
            this.localStorage.remove("otp");
            this.localStorage.remove("PWD");
            this.localStorage.remove("loginType");
            this.localStorage.remove("timerData");
            this.localStorage.set('sms', errormsg["error"]["result"]);
            this.responsesty = "errormsg";
            this.btndisable = "disable";
          });
      }
    }

  }

  convertMailDto() {
    this.registerdto.Email = this.merchantForm.value["Email"];
    this.registerdto.EmailVerified = 0;
    this.registerdto.FirstName = "";
    this.registerdto.LastName = "";
    this.registerdto.Mobile = ""
    this.registerdto.Address = "";
    this.registerdto.City = "";
    this.registerdto.oldPWD = "";
    this.registerdto.PWD = "";
    this.registerdto.Image = "";
    this.registerdto.LoginType = "D";
  }

  ConvertingFormToDto() {

    this._merchentFormData.Categories = this.merchantForm.value["categorie"];
    this._merchentFormData.SellCountries = this.merchantForm.value["SellCountrie"];
    this.selectList.length = 0;
    this.checkedlist.length = 0;
    this.selectList.push(this._merchentFormData.SellCountries);
    this.checkedlist.push(this._merchentFormData.Categories);
    const tab = this.selectList.reduce((acc, value) => !acc.includes(value) ? acc.concat(value) : acc, []).join(',');
    const tab2 = this.checkedlist.reduce((acc, value) => !acc.includes(value) ? acc.concat(value) : acc, []).join(',');

    this._merchentFormData.SellCountries = tab;
    this._merchentFormData.Categories = tab2;

    this._merchentFormData.Name = this.merchantForm.value["Name"];
    this._merchentFormData.ProfileImage = this.finalImage.replace(/^data:image\/[a-z]+;base64,/, "");
    this._merchentFormData.Company = this.merchantForm.value["Company"];
    this._merchentFormData.CompanyImage = this.iconimage.replace(/^data:image\/[a-z]+;base64,/, "");

    this._merchentFormData.Website = this.merchantForm.value["Website"];
    this._merchentFormData.Email = this.merchantForm.value["Email"];
    this._merchentFormData.Country = this.merchantForm.value["country"];
    this._merchentFormData.PWD = this.merchantForm.value["PWD"];
    if (this.Terms == true) {
      this._merchentFormData.TermandCondition = 'Y';
    }

  }

  chkChecked() {

    if (this.Terms == true) {
      this._merchentFormData.TermandCondition = 'Y'
    }
    else {
      this._merchentFormData.TermandCondition = 'N';
    }

  }
  dropdownvalidation() {

    this.btndisable = "disable";
    this.txtErrormsg = true;
    this.chkChecked();

    if (this._merchentFormData.Categories != null) {
      if (this._merchentFormData.Categories.length !== 0) {
        this.pmultiStyleSell = "";
        if (this._merchentFormData.Country !== null) {
          if (this._merchentFormData.Country !== "") {
            this.pdropStyle = "";
            if (this._merchentFormData.SellCountries != null) {
              if (this._merchentFormData.SellCountries.length !== 0) {
                this.pmultiStyleCountry = "";

                if (this.Terms === true) {
                  this.btndisable = "line_btn sblue";
                  this.dropValiderromsg = "";
                  this.txtErrormsg = true;
                }
                else {
                  this.btndisable = "disable";
                  // this.dropValiderromsg = "Please agree terms and conditions";
                  // this.responsesty = "errormsg";
                  // this.txtErrormsg = false;
                }
                // if (this._merchentFormData.TermandCondition == 'Y') {
                //   this.pcheck = "";
                //   this.btndisable = "line_btn sblue";
                //   this.txtErrormsg = true;
                //   this.dropValiderromsg = "";
                // }
                // else {
                //   this.txtErrormsg = false;
                //   this.dropValiderromsg = "Please select terms and conditions";
                //   this.pcheck = "pcheck";
                //   this.pmultiStyleCountry = "";
                //   this.pdropStyle = "";
                //   this.pmultiStyleSell = "";
                // }

              } else {

                this.dropValiderromsg = "Please select merchant sell countries";
                this.txtErrormsg = false;
                this.flage = false;
                this.pmultiStyleCountry = "pmulti";
                this.pdropStyle = "";
                this.pmultiStyleSell = "";
                this.pcheck = "";
              }
            } else {

              // this.dropValiderromsg = "Please select merchant sell countries";
              // this.txtErrormsg = false;
              // this.flage = false;
              // this.pmultiStyleCountry = "pmulti";
              // this.pdropStyle = "";
              // this.pmultiStyleSell = "";
              // this.pcheck = "";
            }
          } else {
            this.responsesty = "errormsg";
            this.dropValiderromsg = "Please select merchant country name";
            this.txtErrormsg = false;
            this.flage = false;
            this.pdropStyle = "pmulti";
            this.pmultiStyleCountry = "";
            this.pmultiStyleSell = "";
            this.pcheck = "";

          }
        } else {
          // this.responsesty = "errormsg";
          // this.dropValiderromsg = "Please select merchant country name";
          // this.txtErrormsg = false;
          // this.flage = false;
          // this.pdropStyle = "pmulti";
          // this.pmultiStyleCountry = "";
          // this.pmultiStyleSell = "";
          // this.pcheck = "";
        }
      } else {

        this.responsesty = "errormsg";
        this.txtErrormsg = false;
        this.flage = false;
        this.dropValiderromsg = "Please select merchant categories name";
        this.pmultiStyleSell = "pmulti";
        this.pdropStyle = "";
        this.pmultiStyleCountry = "";
        this.pcheck = "";
      }
    } else {
      // this.responsesty = "errormsg";
      // this.txtErrormsg = false;
      // this.flage = false;
      // this.dropValiderromsg = "Please select merchant categories name";
      // this.pmultiStyleSell = "pmulti";
      // this.pdropStyle = "";
      // this.pmultiStyleCountry = "";
      // this.pcheck = "";
    }

  }


  formauthdatavalidate() {
    this.btndisable = "disable";
    if (this._merchentFormData.Website != null) {
      if (this._merchentFormData.Website.length > 0) {
        if (this._merchentFormData.Website.match(this.webReg)) {
          this.txtErrormsg = true;
          this.websitevalidmsg = "";
          if (this._merchentFormData.Email != null) {
            if (this._merchentFormData.Email.length > 0) {
              if (this._merchentFormData.Email.match(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)) {
                this.txtErrormsg = true;
                this.emailValiderrormsg = "";
                if (this._merchentFormData.PWD != null) {
                  if (this._merchentFormData.PWD.length >= 8) {
                    if (this._merchentFormData.PWD.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_])[A-Za-z\d@$!_]{8,}$/)) {
                      this.txtErrormsg = true;
                      this.pwdValiderrormsg = "";
                      if (this._merchentFormData.CPWD != null) {
                        if (this._merchentFormData.CPWD.length != 0) {
                          if (this._merchentFormData.PWD == this._merchentFormData.CPWD) {
                            this.txtErrormsg = true;
                            this.cpwdValiderrormsg = "";
                            this.CheckEmail();
                            this.smsmsg = this.localStorage.get('sms');
                            if (this.smsmsg !== "EmailId is already registred") {
                              this.btndisable = "line_btn sblue";
                            }

                          } else {
                            this.btndisable = "disable";
                            this.txtErrormsg = false;
                            this.cpwdValiderrormsg = "Confirm password must match with password";
                            this.dropValiderromsg = "";
                          }
                        } else {
                          this.btndisable = "disable";
                          this.txtErrormsg = false;
                          this.cpwdValiderrormsg = "Confirm password must match with password";
                          this.dropValiderromsg = "";

                        }
                      }
                      else {

                        this.btndisable = "disable";
                        this.txtErrormsg = false;
                        this.cpwdValiderrormsg = "";
                        this.dropValiderromsg = "";
                      }
                    }
                    else {
                      this.btndisable = "disable";
                      this.txtErrormsg = false;
                      this.pwdValiderrormsg = "The password length must be 8 to 12 characters and it should contain at least 1 uppercase,1 lowercase, 1 special character($,@,!,_) and 1 numeric.";
                      this.dropValiderromsg = "";
                    }
                  }
                  else if (this._merchentFormData.PWD.length == 0) {
                    this.txtErrormsg = false;
                    this.pwdValiderrormsg = "The password length must be 8 to 12 characters and it should contain at least 1 uppercase,1 lowercase, 1 special character($,@,!,_) and 1 numeric.";
                    this.btndisable = "disable";
                    this.dropValiderromsg = "";
                  }
                  else if ((this._merchentFormData.PWD.length < 12) && (this._merchentFormData.PWD.length > 0)) {
                    this.btndisable = "disable";
                    this.txtErrormsg = false;
                    this.pwdValiderrormsg = "The password length must be 8 to 12 characters and it should contain at least 1 uppercase,1 lowercase, 1 special character($,@,!,_) and 1 numeric.";
                    this.dropValiderromsg = "";
                  }
                }
                else {
                  this.txtErrormsg = false;
                  this.pwdValiderrormsg = "";
                  this.btndisable = "disable";
                }
              }
              else {
                this.txtErrormsg = false;
                this.emailValiderrormsg = "Please enter valid email";
                this.btndisable = "disable";
                this.dropValiderromsg = "";
                this.div.nativeElement.innerHTML = "";

              }
            }
            else {
              this.txtErrormsg = false;
              this.emailValiderrormsg = "Please enter email";
              this.btndisable = "disable";
              this.dropValiderromsg = "";
              this.div.nativeElement.innerHTML = "";

            }
          }
          else {
            this.btndisable = "disable";
          }
        } else {
          this.txtErrormsg = false;
          this.websitevalidmsg = "Please enter valid website link";
          this.dropValiderromsg = "";
        }
      } else {
        this.txtErrormsg = false;
        this.websitevalidmsg = "Please enter website link";
        this.dropValiderromsg = "";
      }

    } else {
      this.btndisable = "disable";
    }
  }

  HideResponse() {
    setTimeout(() => {
      this.show = true;
    }, 5000);
  }

  prevclick() {

    this.btndisable = "line_btn sblue";
    this.txtErrormsg = true;
    this.div.nativeElement.innerHTML = "";
    const slides = document.getElementsByTagName('li');
    let i = 0;
    for (i = 0; i < slides.length; i++) {
      if (slides[i].getAttribute('class') === 'active') {
        this.currentIndex = slides[i].getAttribute('data-slide-to');

        if (parseInt(this.currentIndex) == 1) {
          //this.prevbtn = "none";
          this.previosusbtn = true;

        }
        else {
          this.prevbtn = "backBtn";
          this.previosusbtn = false;
        }

        if (parseInt(this.currentIndex) == 2) {
          this.submitbtntext = "Submit";
        }
        if (parseInt(this.currentIndex) <= 2) {
          this.submitbtntext = "Next";
        }
      }

    }

  }

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  addMerchent() {
    this.show = true;
    const slides = document.getElementsByTagName('li');
    let i = 0;

    for (i = 0; i < slides.length; i++) {

      if (slides[i].getAttribute('class') === 'active') {

        this.currentIndex = slides[i].getAttribute('data-slide-to');

        if (parseInt(this.currentIndex) >= 0) {

          this.previosusbtn = false;

          this.topheader = "_top";
        }

        if (parseInt(this.currentIndex) != 3) {

          if (parseInt(this.currentIndex) == 0) {

            this.previosusbtn = false;
            this.formauthdatavalidate();
            setTimeout(() => {
              document.getElementById('Website').focus();
            }, 0);
          }
          if (parseInt(this.currentIndex) == 1) {
            this.submitbtntext = "Submit";
            this.btndisable = "disable";
            this.dropdownvalidation();

          } else if (parseInt(this.currentIndex) == 2) {

            // this.dropdownvalidation();
            this.hidenextbtn = true;

            this.show = false;
            this.ConvertingFormToDto();
            this.localStorage.set('merchanturl', this._merchentFormData.Website);
            this.localStorage.set('merchantemail', this._merchentFormData.Email);
            var MerchantRegDto: MerchantRegDto = {
              Id: this._merchentFormData.Id,
              Name: this._merchentFormData.Name,
              ProfileImage: this._merchentFormData.ProfileImage,
              Company: this._merchentFormData.Company,
              CompanyImage: this._merchentFormData.CompanyImage,

              Website: this._merchentFormData.Website,
              Country: this._merchentFormData.Country,

              Email: this._merchentFormData.Email,
              Categories: this._merchentFormData.Categories,
              SellCountries: this._merchentFormData.SellCountries,

              PWD: this._merchentFormData.PWD,
              TermandCondition: this._merchentFormData.TermandCondition,

            }

            this.ProgressSpinnerDlg = true;

            this.div.nativeElement.innerHTML = "";
            this.merchantservice.merchentRegistration(MerchantRegDto).subscribe(res => {
              this.ProgressSpinnerDlg = false;
              this.checkimage = false;

              this.verifybtndisplay = true;
              this.previosusbtn = true;
              setTimeout(() => {

                this.router.navigateByUrl("/customer/home");
              }, 5000);

              this.ResetForm();
              this.finalImage = "";
              this.iconimage = "";

              this.btndisable = "disable";
              this.previosusbtn = true;

            },
              error => {

                this.ProgressSpinnerDlg = false;
                this.show = false;
                this.responsesty = "errormsg";
                this.div.nativeElement.innerHTML = error["result"];

              });

          }
        }
      }
    }

  }

  bindcategories() {
    this.categories.length = 0;
    let catgtype = "O";
    this.categservice.CategoryList(catgtype).subscribe(res => {

      Object.keys(res).map(Key => (
        this.categories.push({ label: res[Key]["name"], value: res[Key]["id"] })

      ));
    })
  }
  bindcountries() {
    this.sellcountry.length = 0;
    this.merchantservice.GetCountries().subscribe(res => {
      Object.keys(res).map(key => (
        this.countries.push({ label: res[key]["description"], value: res[key]["id"] }),
        this.sellcountry.push({ label: res[key]["description"], value: res[key]["id"] })

      ));
    })
  }

  public nameSpace(name, evt) {

    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (name.selectionStart || name.selectionStart == '0') {
      this.caretPos = name.selectionStart;

      if (this.caretPos == 0 && charCode == 32) {
        return false;
      }
    }
    //this._merchentFormData.Name = name.value.trimLeft();
    if(typeof String.prototype.trim !== 'function') {
      String.prototype.trim = function() {
        return this._merchentFormData.Name.replace(/^\s+|\s+$/g, ''); 
      }
  }
}

  public companyNameSpace(companyname, evt) {

    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (companyname.selectionStart || companyname.selectionStart == '0') {
      this.caretPos = companyname.selectionStart;

      if (this.caretPos == 0 && charCode == 32) {
        return false;
      }
    }
   //this._merchentFormData.Company = companyname.value.trimLeft();
   if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
      return this._merchentFormData.Company.replace(/^\s+|\s+$/g, ''); 
    }
  }
  
    
  }

  onKeyPress(event: any) {

    this.show = true;
  }

  catFilter(selectedCat: string) {

    this._merchentFormData.SellCountries = selectedCat;
  }

  ResetForm() {

    this.merchantForm.reset({
      'Name': '',
      'Website': '',
      'Email': '',
      'mobile': '',
      'Address': '',
      'Country': 'Select Country',
      'Categories': '',
      'SellCountries': '',
      'PWD': '',
      'Company': '',
      'CompanyImage': '',
      'Id': 0,
      'IsLegalApproved': 0,
      'ProfileImage': '',
      'TermandCondition': ''
    });
  }

  removeprofileimage() {
    this.finalImage = "";
    this.btnupload1 = "uploadimgsty uploadimgsty1";
    this.removeicon = true;
  }

  IsAcceptterms(event) {
    if (this.Terms === true) {
      this.TermandCondition = "Y";
      this.dropdownvalidation();
    }
    else {
      this.btndisable = "disable";
      this.responsesty = "errormsg";
      this.txtErrormsg = false;
      this.dropValiderromsg = "Please agree terms and conditions";
    }
  }
}