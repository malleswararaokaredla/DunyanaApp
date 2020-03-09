import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  headerlogo:string="assets/layout/images/header_logo.png";
  checkinfo:string="assets/layout/images/animated-check.gif";
  constructor() { }

  ngOnInit() {
  }

}
