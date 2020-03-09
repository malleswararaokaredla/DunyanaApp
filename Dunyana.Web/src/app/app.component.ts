import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LangShareService } from './shared/services/lang-share.service';
import { TranslateService } from '@ngx-translate/core';
import { IpmanagementService } from './pages/customer/services/Ipmanagement.service';
import { LocalStorageService } from 'angular-web-storage';
import { } from 'googlemaps';
import { Timezonelist } from 'src/app/shared/Timezoneslist';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dunyana.web';
  zone: string = "";
  countryzonename: string = "";

  constructor(private router: Router,
    public langShare: LangShareService,
    public translate: TranslateService, private ipservice: IpmanagementService,
    private localstorage: LocalStorageService) {

    this.ipservice.Getipinfo().subscribe(res => {
      this.countryzonename = res["timezone"];
      console.log(this.countryzonename);

      Timezonelist.ZoneList.forEach(z => {
        if (z["ZoneName"].toLowerCase() == this.countryzonename.toLowerCase()) {
          this.zone = z["Timezonename"];
          console.log(this.zone);
          this.localstorage.set("Zone", this.zone);
        }
      });

    });
    //let Zonename = (new Date()).toTimeString().match(new RegExp("[A-Z](?!.*[\(])", "g")).join('');
    // let zonegmt = /.*\s(.+)/.exec((new Date()).toLocaleDateString(navigator.language, { timeZoneName: 'short' }))[1];

    // Timezonelist.ZoneList.forEach(x => {
    //   if ((x["Abbreviation"] == Zonename.toString()) && (x["GMT"] == zonegmt.toString())) {
    //     this.zone = x["Name"];
    //     this.localstorage.set("Zone", this.zone);
    //   }
    // });

   // console.log(moment(new Date()).toString());
  //  console.log(moment);

  }

}
