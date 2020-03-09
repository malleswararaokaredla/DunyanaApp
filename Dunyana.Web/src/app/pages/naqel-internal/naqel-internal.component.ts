import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-naqel-internal',
  templateUrl: './naqel-internal.component.html',
  styleUrls: ['./naqel-internal.component.scss']
})
export class NaqelInternalComponent implements OnInit {

  constructor(private localStorage: LocalStorageService, private router: Router) { }

  ngOnInit() {
    if (this.localStorage.get('Email') === null) {
      this.localStorage.clear();
      this.router.navigateByUrl('signin');
    }
    else if(this.localStorage.get("loginType")=="NL" || this.localStorage.get("loginType")=="NC" || this.localStorage.get("loginType")=="NF")
      {
        this.router.navigateByUrl("naqel/naqel-profile");
      }
  }
}


