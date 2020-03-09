import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-customer-service',
  templateUrl: './customer-service.component.html',
  styleUrls: ['./customer-service.component.scss']
})
export class CustomerServiceComponent implements OnInit {

  @ViewChild('map') mapElement: any;

  constructor() { }
  lat: number = 23.8859;
  lng: number = 45.0792;
  ngOnInit() {
    this.gotoTop();
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
