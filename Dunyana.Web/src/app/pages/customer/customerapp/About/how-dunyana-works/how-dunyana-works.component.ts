import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-how-dunyana-works',
  templateUrl: './how-dunyana-works.component.html',
  styleUrls: ['./how-dunyana-works.component.scss']
})
export class HowDunyanaWorksComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    if (document.getElementById('search_container')) {
      var r = document.getElementById('search_container');
      r.setAttribute('style','display:none;');
    }
  }

}
