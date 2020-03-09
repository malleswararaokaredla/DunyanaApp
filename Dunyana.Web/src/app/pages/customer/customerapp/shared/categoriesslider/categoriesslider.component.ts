import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LangShareService } from 'src/app/shared/services/lang-share.service';
import { TranslateService } from '@ngx-translate/core';
import { CategoryService } from 'src/app/pages/admin/services/category.service';
import { LocalStorageService } from 'angular-web-storage';
@Component({
  selector: 'app-categoriesslider',
  templateUrl: './categoriesslider.component.html',
  styleUrls: ['./categoriesslider.component.scss']
})
export class CategoriessliderComponent implements OnInit {

  slideNo = 0;
  withAnim = true;
  resetAnim = true;
  items: any[] = [];
  Shopbycategory: string = "Shop By Category";
  selectecatid: number = 0;
  isempty: boolean = true;
  @Input() childMessage: string;
  childcustMessage: string = "";
  hidesliderbtns: string = "";
  ProgressSpinnerDlg: boolean = false;
  @ViewChild('categoryCarousel') categoryCarousel: NguCarousel<any>;

  categorycarouselConfig: NguCarouselConfig = {
    grid: { xs: 2, sm: 3, md: 5, lg: 5, all: 0 },
    load: 5,
    interval: { timing: 4000, initialDelay: 1000 },
    loop: true,
    touch: true,
    slide: 1,
    velocity: 0.2
  }

  categorycarouselItems = [{ name: "Fashion", img: "assets/layout/images/cat_img_fash.jpg" }, { name: "Shoes", img: "assets/layout/images/cat_img_shoes.jpg" },
  { name: "Sports & Fitness", img: "assets/layout/images/cat_img_sports.jpg" }, { name: "Accessories & Beauty", img: "assets/layout/images/cat_img_beauty.jpg" },
  { name: "Virtual Mall", img: "assets/layout/images/cat_img_virtual.jpg" }, { name: "Fashion", img: "assets/layout/images/cat_img_fash.jpg" },
  { name: "Shoes", img: "assets/layout/images/cat_img_shoes.jpg" }, { name: "Sports & Fitness", img: "assets/layout/images/cat_img_sports.jpg" },
  { name: "Accessories & Beauty", img: "assets/layout/images/cat_img_beauty.jpg" }];

  constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer, private route: Router,
    public langShare: LangShareService,
    public translate: TranslateService, private catgservice: CategoryService, private localStorage: LocalStorageService) {
  }

  ngOnInit() {

    if (this.childMessage === "home") {
      this.childcustMessage = "Shop By Category";
    }
    else if (parseInt(this.childMessage) > 0) {
      this.childcustMessage = "Shop By Category";
    }

    this.LoadCategories();
    this.gotoTop();
  }
  catmoveTo(slide) {
    this.categoryCarousel.moveTo(slide, !this.withAnim);
  }

  navigatetocategory(catid) {


    if (this.childMessage === "Shop by category") {

      if (this.localStorage.get("selectedcatgid") != null) {
        this.localStorage.remove("selectedcatgid");
      }
      else {
      }
      this.route.navigateByUrl('customer/shopping/' + catid);
      this.selectecatid = catid;
    }
    else {
      this.route.navigateByUrl('customer/shopping/' + catid);
      this.localStorage.set("selectedcatgid", catid);
      this.selectecatid = this.localStorage.get("selectedcatgid");
    }
  }
  LoadCategories() {

    this.ProgressSpinnerDlg = true;

      let catgtype = "O";
      this.catgservice.CategoryList(catgtype).subscribe(res => {
        if (res.length > 0) {
  
          if (res.length <= 5) {
            this.hidesliderbtns = "hide";
          }
          else {
            this.hidesliderbtns = "";
          }
          res.forEach(img => {
            img["image"] = img["image"]
            this.items.push(img);
          });
  
          this.localStorage.set("catid", this.items[0]["id"]);
  
          if (this.childMessage === "Shop by category") {
  
            if (this.localStorage.get("selectedcatgid") != null) {
              this.selectecatid = this.localStorage.get("selectedcatgid");
              this.localStorage.remove("selectedcatgid");
            }
            else {
              this.selectecatid = this.items[0]["id"];
            }
  
          }
        }
        else {
          this.isempty = false;
        }
        this.ProgressSpinnerDlg = false;
      });
    
  
  }

  // goDown() {
  //   let scrollToTop = window.setInterval(() => {
  //     let pos = window.pageYOffset;
  //     let brands = document.getElementById("brands").offsetTop;

  //     if (brands) {

  //       if (pos < brands) {
  //         window.scrollTo(brands, brands);
  //       } else {
  //         window.clearInterval(scrollToTop);
  //       }
  //     }
  //   }, 5);
  // }
  
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
}
