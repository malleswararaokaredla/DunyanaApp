import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-become-seller',
  templateUrl: './become-seller.component.html',
  styleUrls: ['./become-seller.component.scss']
})
export class BecomeSellerComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    if (document.getElementById('search_container')) {
      var r = document.getElementById('search_container');
      r.setAttribute('style', 'display:none;');
    }
  }
}
