import { Component, OnInit } from '@angular/core';
import { LangShareService } from 'src/app/shared/services/lang-share.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-merchant-header',
  templateUrl: './merchant-header.component.html',
  styleUrls: ['./merchant-header.component.scss']
})
export class MerchantHeaderComponent implements OnInit {

  translationMessages: any;
  lang = 'en';
  currentlang = "";
  showDiv = "";
  showlngDiv = "";
  useremail: string;
  islogin: boolean = false;
  englicon: boolean;

  searchdata: any = "";
  timeout = null;

  logoimg: string;
  headerimg = "assets/layout/images/header_logo.png";

  header_ar_img = "assets/layout/images/header_logo_ar.png";
  englnfimg = "assets/layout/images/flag_uk.png";
  spanlanimg = "assets/layout/images/flag_saudi.png";

  name: string;

  constructor(public langShare: LangShareService,
    public translate: TranslateService, private localStorage: LocalStorageService, private route: Router

  ) { }

  ngOnInit() {

    this.logoimg = this.headerimg;

    if (this.localStorage.get('lang') != null) {

      this.lang = this.localStorage.get('lang');
      this.translate.use(this.lang);

      if (this.lang == "en") {
        this.currentlang = "العربية";
        this.englicon = true;
      }
      else if (this.lang == "ar") {
        this.currentlang = "English";
      }
    }
    else {
      this.currentlang = "العربية";
      this.englicon = true;
    }
    this.langShare.setTranslate(this.translate);
    this.translation();

    if (this.localStorage.get("username")) {
      this.useremail = this.localStorage.get("username");
      this.islogin = true;
    }
  }
  toggleLang(lang) {

    this.lang = lang;
    this.translate.use(lang);
    this.langShare.setTranslate(this.translate);
    if (lang == "en") {

      this.logoimg = this.header_ar_img;
      this.currentlang = "العربية";

      this.englicon = true;
    }
    else if (lang == "ar") {

      this.logoimg = this.headerimg;
      this.englicon = false;
      this.currentlang = "English";
    }
    this.localStorage.set('lang', lang);

  }
  translation() {
    this.langShare.translate$.subscribe(translate => {
      this.translate = translate;
      translate.get('Global').subscribe(data => {
        this.translationMessages = data;
      });
    });
  }


  displaylang() {
    this.showlngDiv = "showDiv";
  }

  gotoTop() {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20); 
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 5);
  }

  logout() {

    this.localStorage.remove("username");
    this.localStorage.remove("Email");
    this.localStorage.remove("customerid");
    this.localStorage.remove("otp");
    this.localStorage.remove("PWD");
    this.islogin = false;
    this.route.navigateByUrl('customer/home');
  }
}
