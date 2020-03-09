import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { categorymanagementService } from '../../services/categorymanagement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NguCarouselConfig, NguCarousel } from '@ngu/carousel';
import { CategoryService } from 'src/app/pages/admin/services/category.service';
import { CategoryWiseMerchants } from '../../model/CategoryWiseMerchants';
import { PagerService } from '../../services/pager.service';
import { LocalStorageService } from 'angular-web-storage';
import { deals } from '../../model/deals';
import { DealsmanagementService } from '../../services/dealsmanagement.service';
import { TranslateService } from '@ngx-translate/core';
import { Promotionals } from 'src/app/pages/admin/services/Promotionals.service';
import { MerchantByCategory } from '../../model/MerchantByCategory';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss']
})
export class ShoppingComponent implements OnInit {

  withAnim = true;
  @ViewChild('headerCarousel') headerCarousel: NguCarousel<any>;
  display: boolean = false;

  parentMessage:string="";
  headercarouselItems: any = [];
  CategoryID: number;
  ProgressSpinnerDlg: boolean = false;
  categorywisemerchants: Array<CategoryWiseMerchants> = [];
  pager: any = {};
  totalorderproductsRecords:number=0;
  pagedItems: Array<CategoryWiseMerchants> = [];
  alphabetpaging = [ '#','A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];
  filtereditems:any[]=[];
  isempty:boolean=true;
  selectedchar:string='#';

  dealspromotions: any[] = [];
  randomdealsitem: any = {};

  dealsdata: deals = {
    type: null,
    country: null,
    page: null,
    language: null
  }

  merchantByCat:MerchantByCategory={
    categoryID:0,
    ipcountry:null
  }
  
  engbannerslist: any = [];
  arbbannerlist: any = [];
  bannerslist: any[] = [];
  adminpromotionslist:any[]=[];
  adminpromotionsenglist: any = [];
  adminpromotionsarbclist: any = [];

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    load: 1,
    interval: { timing: 4000, initialDelay: 1000 },
    loop: true,
    touch: true,
    velocity: 0.2,
    point: {
      visible: true,
      hideOnSingleSlide: true
    }
  }
  displaySearchDiv: boolean;
  constructor(private categoryservice: categorymanagementService, private router: ActivatedRoute,
    private catgservice: CategoryService,private pagerService:PagerService,
    private localStorage: LocalStorageService,private route:Router,
    private dealsservice: DealsmanagementService,public translate: TranslateService,private adminserivice: Promotionals) { }

  ngOnInit() {
    
    this.displaySearchDiv=false;
    if (document.getElementById('search_container')) {
      var r = document.getElementById('search_container');
      r.setAttribute('style','display:inline;');
    }
    
    this.CategoryID = this.router.snapshot.params["catid"];
    this.router.params.subscribe(params => {
      this.parentMessage=params['catid'];
      this.CategoryID = params['catid'];
      if(this.router.snapshot.params["catid"]!="null")
      {
        this.GetMerchantByCategoryID();

      }
      else
      {
        this.isempty=false;
      }
    });
    this.BannersList();
    this.dealsdata.page = "H";
    this.dealsdata.country = "Saudi Arabia";

    this.dealsservice.GetDealsList().subscribe(res => {
      if (res.length > 0) {
      this.dealspromotions=res;
        this.randomdealsitem = this.dealspromotions[Math.floor(Math.random() * this.dealspromotions.length)];
      }

    });

    this.Getpromotionalcontent();
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

  moveTo(slide) {
    this.headerCarousel.moveTo(slide, !this.withAnim);
  }

  GetMerchantByCategoryID() {
    this.ProgressSpinnerDlg = true;
    this.categorywisemerchants = [];
    this.merchantByCat.categoryID=this.CategoryID;
    this.merchantByCat.ipcountry=this.localStorage.get("countryname");
    this.categoryservice.GetMerchantbyCategoryId(this.merchantByCat).subscribe(res => {

      this.categorywisemerchants=res;

      this.totalorderproductsRecords=this.categorywisemerchants.length;
      this.Filterbyalphabet('');
      this.goDown();
    });

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

  Getpromotionalcontent() {
    this.adminserivice.Getadminhomepromotionslist().subscribe(res => {
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

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.filtereditems.length, page, 4);
    this.pagedItems = this.filtereditems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  
Filterbyalphabet(char)
{
  if(this.selectedchar=='')
  {
    this.selectedchar='#';
  }
  else
  {
    this.selectedchar=char;
  }

 this.filtereditems=this.filter(this.categorywisemerchants,1,char);
 if(this.filtereditems.length>0)
 {
  this.setPage(1);
  this.isempty=true;
 }
 else
 {
  this.pagedItems=[];
  this.pager={};
  this.isempty=false;
 }
 this.ProgressSpinnerDlg = false;
}

filter(merchantsdata, index, letter) {
  if(letter==='' || letter==='#')
  {
    return merchantsdata;
  }
  else
  {
   var filteredNames = merchantsdata.filter( 
     res=>{
       if(res["merchantName"][0].toLowerCase()===letter.toLowerCase())
       {
       return res;
       }
      }
   );
   return filteredNames;
  }
}

redirecttomarchantsite(url)
{
  if(url!=null)
  {
    if(this.localStorage.get("Email"))
    {
     // url=url+"/"+this.localStorage.get("customerid");
      window.open(url);
    }
    else
    {
      this.localStorage.set("merchanturl",url);
          this.route.navigateByUrl("signin");
    }
  }
  else
  {
    this.display = true;
   
  }
 
  }
  shopbycategory() {
    this.route.navigateByUrl('customer/shopping/' + this.localStorage.get("catid"));
  }

  redirecttomarchant(dealprom) {
    if (this.localStorage.get("Email")) {
      window.open(dealprom["merchantUrl"]);
    }
    else {
      this.localStorage.set("merchanturl", dealprom["merchantUrl"]);
      this.route.navigateByUrl("signin");
    }
  }
  onDialogClose(event) {
    this.display = event;
  }
  Navigatetomerchanturl(item)
  {
    if (this.localStorage.get("Email")) {
      window.open(item.bannerURL);
    }
    else {
      this.localStorage.set("merchanturl", item.bannerURL);
      this.route.navigateByUrl("signin");
    }
  }
}
