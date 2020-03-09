import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchingService } from '../../services/searching.service';
import { SearchesultDto } from '../../model/DTOs/SearchesultDto';
import { LocalStorageService } from 'angular-web-storage';
import { PagerService } from '../../services/pager.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  display: boolean = false;

  totaldealsRecords: any;
  pager: any = {};
  pagedItems: any[] = [];
  filtereditems: any[] = [];
  isempty: boolean = true;
  selectedchar: string = '#';

  searchresult: SearchesultDto[];
  public searchlist: any[] = [];
  customerid: string;
  weburl: string;
  parentMessage: string = "Shop By Category";
  catname: string = "";
  ProgressSpinnerDlg: boolean = false;

  alphabetpaging = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  constructor(private router: ActivatedRoute, private _SearchingService: SearchingService, private localStorage: LocalStorageService,
    private route: Router, private pagerService: PagerService) {
    
  }

  ngOnInit() {
    this.catname = this.router.snapshot.params['searchdata'];

    this.router.params.subscribe(val => {

      this.catname = val['searchdata'];

      this.customerid = this.localStorage.get("customerid");
      if (this.catname != "") {

        this.Getsearchingdata();

      } else {

        this.isempty = false;
      }
    })
  }



  Getsearchingdata() {
    this.ProgressSpinnerDlg = true;

    this._SearchingService.GetSearchData(this.catname).subscribe(res => {
      this.searchlist = res;
      this.ProgressSpinnerDlg = false;
      this.Filterbyalphabet('');
      this.weburl = res["website"];
      this.catname = "";
    });
  }

  filter(catname, index, letter) {
    if (letter === '' || letter === '#') {
      return catname;
    }
    else {
      var filteredNames = catname.filter(
        res => {

          if (res["name"][0].toLowerCase() === letter.toLowerCase()) {
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
    this.filtereditems = [];
    this.filtereditems = this.filter(this.searchlist, 1, char);

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
  setPage(page: number) {

    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.filtereditems.length, page, 4);
    this.pagedItems = this.filtereditems.slice(this.pager.startIndex, this.pager.endIndex + 1);

  }

  redirecturl(url) {

    if (url != null) {
      if (this.localStorage.get("Email")) {
        url = url + "/" + this.localStorage.get("customerid");
        window.open(url);
      }
      else {
        this.localStorage.set("merchanturl", url);
        this.route.navigateByUrl("signin");
      }
    }
    else {
      this.display = true;
    }
  }
  onDialogClose(event) {
    this.display = event;
  }
}