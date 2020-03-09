import { Component, OnInit } from '@angular/core';
import { LangShareService } from 'src/app/shared/services/lang-share.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-admin-footer',
  templateUrl: './admin-footer.component.html',
  styleUrls: ['./admin-footer.component.scss']
})
export class AdminFooterComponent implements OnInit {

  lang = 'en';
  display: boolean = false;
  imgfooter="assets/layout/images/footer_logo.png";
  constructor(public langShare: LangShareService,
    public translate: TranslateService,private localStorage: LocalStorageService) { }

  ngOnInit() {
    if(this.localStorage.get('lang') != null){
      this.lang = this.localStorage.get('lang'); 
      this.translate.use(this.lang); 
    }
    else {
      this.translate.use(this.lang); 
    }
  }
  showDialog() {
    this.display = true;
}
onDialogClose(event) {
   this.display = event;
}

gotoTop(){
  let scrollToTop = window.setInterval(() => {
    let pos = window.pageYOffset;
    if (pos > 0) {
        window.scrollTo(0, pos - 20); // how far to scroll on each step
    } else {
        window.clearInterval(scrollToTop);
    }
}, 5);
}


}
