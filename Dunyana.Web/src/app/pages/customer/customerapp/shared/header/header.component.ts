import { Component, OnInit, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { LangShareService } from 'src/app/shared/services/lang-share.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { OrdermanagementService } from '../../../services/ordermanagemet.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('searchfocus') searchfocus: ElementRef;
  translationMessages: any;
  lang = 'en';
  currentlang = "";
  showDiv = "";
  showlngDiv = "";
  useremail: string;
  islogin: boolean = false;
  englicon: boolean;
  emptytext: string = "placeholder";
  iscusmrlogin: boolean = false;

  searchdata: any = "";
  timeout = null;

  logoimg: string;
  headerimg = "assets/layout/images/header_logo.png";

  header_ar_img = "assets/layout/images/header_logo_ar.png";
  englnfimg = "assets/layout/images/flag_uk.png";
  spanlanimg = "assets/layout/images/flag_saudi.png";

  name: string;
  displaySearchDiv: boolean = false;
  isthreechar:boolean=true;

  constructor(public langShare: LangShareService,
    public translate: TranslateService, private localStorage: LocalStorageService, private router: Router,
    private orderservice: OrdermanagementService, private route: Router,
    @Inject(PLATFORM_ID) private platformId: object, private eRef: ElementRef
  ) {

  }

  ngOnInit() {
    if (document.getElementById('search_container')) {
      var r = document.getElementById('search_container');
      r.setAttribute('style', 'display:none;');
    }

    if (this.localStorage.get("loginType") === "C") {
      this.iscusmrlogin = true;
    }
    else {
      this.iscusmrlogin = false;
    }
    this.logoimg = this.headerimg;

    this.showDiv = "";
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
  displaysearch(searchid: string) {

    this.displaySearchDiv = true;
    this.showDiv = "showDiv";
    this.searchdata = "";
    this.localStorage.set('showDiv', this.showDiv);

    setTimeout(() => {
      document.getElementById('searchfocus').focus()
    }, 0);

  }
  closesearch() {
    this.showDiv = "";
    this.showDiv = "search_container";
    this.isthreechar=true;

  }
  displaylang() {
    this.showlngDiv = "showDiv";
  }

  logout() {
    this.orderservice.orderhistorydetailsdata = [];
    this.orderservice.orderhistorydetailsdata.length = 0;
    this.localStorage.remove("username");
    this.localStorage.remove("Email");
    this.localStorage.remove("customerid");
    this.localStorage.remove("otp");
    this.localStorage.remove("PWD");
    this.localStorage.remove("loginType");
    this.localStorage.remove("timerData");
    sessionStorage.clear();
    this.islogin = false;
    this.router.navigateByUrl('customer/home');
    this.iscusmrlogin = false;
  }
  shopbycategory() {
    if(document.getElementById("catg") == null) {
      this.route.navigateByUrl('customer/shopping/' + this.localStorage.get("catid"));
    } else {
      this.goDown();
    }
    //this.route.navigateByUrl('customer/shopping/' + this.localStorage.get("catid"));
  }

  goDown() {
    let scrollToTop = window.setInterval(() => {
   //   let pos = window.pageYOffset;
      let brands = document.getElementById("catg").offsetTop;
      window.scrollTo(0, brands);
      if (brands > 0) {
        window.clearInterval(scrollToTop);
      }
    }, 5);
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

  searchresult() {

    if (this.searchdata != "") {
      this.searchdata=this.searchdata.trim();
      if(this.searchdata.trim().length>=3)
      {
        this.router.navigateByUrl("customer/search/" + this.searchdata);
        this.showDiv = "";
        this.isthreechar=true;
      }
      else
      {
        this.showDiv = "emptytextshowDiv";
        this.isthreechar=false;
      }
    } else {
      this.showDiv = "emptytextshowDiv";
    }
  }
}
