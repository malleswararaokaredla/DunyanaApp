import { Component, OnInit } from '@angular/core';
import { DealsmanagementService } from '../../../services/dealsmanagement.service';
import { PagerService } from '../../../services/pager.service';
import { deals } from '../../../model/deals';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-deals-promotions',
  templateUrl: './deals-promotions.component.html',
  styleUrls: ['./deals-promotions.component.scss']
})
export class DealsPromotionsComponent implements OnInit {

  dealslist: any[] = [];
  totaldealsRecords: any;
  pager: any = {};
  pagedItems: any[] = [];

  arpager: any = {};
  arpagedItems: any[] = [];

  filtereditems: any[] = [];
  arfiltereditems: any[] = [];
  isempty: boolean = true;
  selectedchar: string = '#';
  engdealslist: any[] = [];
  arbdealslist: any[] = [];
  currentlang: string;


  dealsdata: deals = {
    type: null,
    country: null,
    page: null,
    language: null
  }

  alphabetpaging = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  constructor(private dealsservice: DealsmanagementService, private pagerService: PagerService,
    private localStorage: LocalStorageService, private router: Router, public translate: TranslateService) { }

  ngOnInit() {

    this.currentlang = this.translate.store.currentLang;
    this.dealsdata.page = "I";
    this.dealsdata.country = "UK";

    this.dealsservice.GetDealsList().subscribe(res => {

      this.dealslist = res;
      if (this.dealslist.length > 0) {
        this.dealslist.forEach(x => {
          if (x["englishImage"] != "") {
            this.engdealslist.push(x);
          }
        });
        this.dealslist.forEach(x => {
          if (x["arabicImage"] != "") {
            this.arbdealslist.push(x);
          }
        });
        this.Filterbyalphabet('');
        this.ArbFilterbyalphabet('');
      }
      else {

      }

    });
    this.gotoTop();

  }

  filter(dealsdata, index, letter) {
    if (letter === '' || letter === '#') {
      return dealsdata;
    }
    else {
      var filteredNames = dealsdata.filter(
        res => {

          if (res["dealName"][0].toLowerCase() === letter.toLowerCase()) {
            return res;
          }
        }
      );
      return filteredNames;
    }
  }

  Filterbyalphabet(char) {

    if (char === '') {
      this.selectedchar = '#';
    }
    else {
      this.selectedchar = char;
    }

    this.filtereditems = this.filter(this.engdealslist, 1, char);

    if (this.filtereditems.length > 0) {
      this.setPage(1);
      this.isempty = true;
    }
    else {
      this.pagedItems = [];
      this.pager = {};
      this.isempty = false;
    }

  }


  ArbFilterbyalphabet(char) {

    if (char === '') {
      this.selectedchar = '#';
    }
    else {
      this.selectedchar = char;
    }

    this.arfiltereditems = this.filter(this.arbdealslist, 1, char);

    if (this.arfiltereditems.length > 0) {
      this.arsetPage(1);
      this.isempty = true;
    }
    else {
      this.arpagedItems = [];
      this.arpager = {};
      this.isempty = false;
    }

  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.filtereditems.length, page, 4);
    this.pagedItems = this.filtereditems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  arsetPage(page: number) {
    if (page < 1 || page > this.arpager.totalPages) {
      return;
    }
    this.arpager = this.pagerService.getPager(this.arfiltereditems.length, page, 4);
    this.arpagedItems = this.arfiltereditems.slice(this.arpager.startIndex, this.arpager.endIndex + 1);
  }

  redirecttomerchant(dealprom) {
    console.log('DEAL PROMOTIONS LINK ===>>> ', dealprom);
    if (this.localStorage.get("Email")) {
      window.open(dealprom["dealURL"]);
    }
    else {
      this.localStorage.set("merchanturl", dealprom["dealURL"]);
      this.router.navigateByUrl("signin");
    }
  }
  gotoTop(){
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20); 
      } else {
          window.clearInterval(scrollToTop);
      }
  }, 5);
  }
}
