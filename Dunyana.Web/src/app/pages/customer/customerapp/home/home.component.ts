import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NguCarouselConfig, NguCarousel } from '@ngu/carousel';
import { DomSanitizer } from '@angular/platform-browser';
import { LangShareService } from 'src/app/shared/services/lang-share.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'angular-web-storage';
import { CategoryService } from 'src/app/pages/admin/services/category.service';
import { Router } from '@angular/router';
import { DealsmanagementService } from '../../services/dealsmanagement.service';
import { GeolocationService } from 'src/app/shared/services/country.service';
import { deals } from '../../model/deals';
import { Promotionals } from 'src/app/pages/admin/services/Promotionals.service';
import { IpmanagementService } from '../../services/Ipmanagement.service';
import { Timezonelist } from 'src/app/shared/Timezoneslist';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  fb_badge_img = "assets/layout/images/fb_badge_img.jpg";
  slideNo = 0;
  withAnim = true;
  resetAnim = true;
  parentMessage = "home";
  translationMessages: any;
  lang: string;
  showDiv: any;
  name: any;
  headercarouselItems: any[] = [];
  bannerslist: any[] = [];
  dealspromotions: any[] = [];
  randomdealsitem: any = {};
  countryzonename: string = "";

  engbannerslist: any = [];
  arbbannerlist: any = [];
  adminpromotionslist: any[] = [];
  adminpromotionsenglist: any = [];
  adminpromotionsarbclist: any = [];
  @ViewChild('headerCarousel') headerCarousel: NguCarousel<any>;
  displaySearchDiv: boolean;
  homeProgressSpinnerDlg: boolean = false;
  countryfind: boolean = false;

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    load: 1,
    interval: { timing: 4000, initialDelay: 1000 },
    loop: true,
    touch: true,
    velocity: 0.2,
    point: {
      visible: true,
      hideOnSingleSlide: false
    }
  }
  dealsdata: deals = {
    type: null,
    country: null,
    page: null,
    language: null
  }

  setPosition: any;
  geolocationPosition: Position;
  r: any;

  constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer,
    public langShare: LangShareService, private ipmanagement: IpmanagementService,
    public translate: TranslateService, private localStorage: LocalStorageService,
    private catgservice: CategoryService, private router: Router, private dealsservice: DealsmanagementService,
    private geolocservice: GeolocationService, private adminserivice: Promotionals) {
  }


  ngOnInit() {
    this.SetZone();
    this.homeProgressSpinnerDlg = true;
    if (this.localStorage.get("countryname")) {
      this.Executeinitcode();
    }
    else {
      this.ipmanagement.Getipinfo().subscribe(res => {
        this.localStorage.set("countryname", res["country_name"]);
        this.Executeinitcode();
      });
    }
  }



  translation() {
    this.langShare.translate$.subscribe(translate => {
      this.translate = translate;
      translate.get('Global').subscribe(data => {
        this.translationMessages = data;
      });
    });
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }


  moveTo(slide) {
    this.headerCarousel.moveTo(slide, !this.withAnim);
  }

  public getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  BannersList() {
    let type = "O";
    this.catgservice.GetAllBanners().subscribe(res => {
      this.bannerslist = res;

      const shuffled = this.bannerslist.sort(() => 0.5 - Math.random());

      this.headercarouselItems = shuffled.slice(0, 3);
      this.headercarouselItems.forEach(row => {
        if (row["englishImage"] != "") {
          this.engbannerslist.push(row);
        }
        if (row["arabicImage"] != "") {
          this.arbbannerlist.push(row);
        }
      });
    });

  }
  shopbycategory() {
    this.displaySearchDiv = false;
    this.router.navigateByUrl('customer/shopping/' + this.localStorage.get("catid"));

  }

  redirecttomarchant(dealprom) {
    if (this.localStorage.get("Email")) {
      window.open(dealprom["merchantUrl"]);

    }
    else {
      this.localStorage.set("merchanturl", dealprom["merchantUrl"]);
      this.router.navigateByUrl("signin");
    }
  }

  Navigatetomerchanturl(item) {

    if (item.bannerURL) {
      if (this.localStorage.get("Email")) {
        window.open(item.bannerURL);
      }
      else {
        this.localStorage.set("merchanturl", item.bannerURL);
        this.router.navigateByUrl("signin");
      }
    }

  }

  Navigatetoadminpromotionalurl(item) {
    if (item.adminPromotionalURL != "") {
      if (this.localStorage.get("Email")) {
        window.open(item.adminPromotionalURL);
      }
      else {
        this.localStorage.set("merchanturl", item.adminPromotionalURL);
        this.router.navigateByUrl("signin");
      }
    }

  }
  Getpromotionalcontent() {
    this.homeProgressSpinnerDlg = true;
    this.adminserivice.Getadminhomepromotionslist().subscribe(res => {
     this.homeProgressSpinnerDlg = false;
      this.adminpromotionslist = res;

      this.adminpromotionslist.forEach(row => {
        if (row["englishImage"] != "") {
          this.adminpromotionsenglist.push(row);
        }
        if (row["arabicImage"] != "") {
          this.adminpromotionsarbclist.push(row);
        }
      });
    });
  }

  Executeinitcode() {
    this.countryfind = true;
    this.homeProgressSpinnerDlg = false;

    if (document.getElementById('search_container')) {
      var r = document.getElementById('search_container');
      r.setAttribute('style', 'display:none;');
    }

    if (this.localStorage.get('lang') != null) {
      this.lang = this.localStorage.get('lang');
      this.translate.use(this.lang);
    }
    this.langShare.setTranslate(this.translate);
    this.translation();

    this.name = this.localStorage.get('username');
    this.BannersList();

    this.dealsdata.page = "H";
    this.dealsdata.country = "Saudi Arabia";

    this.dealsservice.GetDealsList().subscribe(res => {
      if (res.length > 0) {
        this.dealspromotions = res;

        this.randomdealsitem = this.dealspromotions[Math.floor(Math.random() * this.dealspromotions.length)];
      }

    });
    this.Getpromotionalcontent();
  }

  SetZone() {
    let zone = "";
    // let Zonename = (new Date()).toTimeString().match(new RegExp("[A-Z](?!.*[\(])", "g")).join('');
    // let zonegmt = /.*\s(.+)/.exec((new Date()).toLocaleDateString(navigator.language, { timeZoneName: 'short' }))[1];
    // Timezonelist.ZoneList.forEach(x => {
    //   if ((x["Abbreviation"] == Zonename.toString()) && (x["GMT"] == zonegmt.toString())) {
    //     zone = x["Name"];
    //     this.localStorage.set("Zone", zone);
    //   }
    // });

    this.ipmanagement.Getipinfo().subscribe(res => {
      this.countryzonename = res["timezone"];
      console.log(this.countryzonename);

      Timezonelist.ZoneList.forEach(z => {
        if (z["ZoneName"].toLowerCase() == this.countryzonename.toLowerCase()) {
          zone = z["Timezonename"];
          console.log(zone);
          this.localStorage.set("Zone", zone);
        }
      });
      //  this.localStorage.set("Zone", zone);

    });
    // this.localStorage.set("Zone", "India Standard Time");

  }
}
