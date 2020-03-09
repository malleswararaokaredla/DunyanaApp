import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-our-story',
  templateUrl: './our-story.component.html',
  styleUrls: ['./our-story.component.scss']
})
export class OurStoryComponent implements OnInit {

  storybanner="assets/layout/images/story_banner.jpg";
  constructor() { }

  ngOnInit() {
    var r = document.getElementById('search_container');
    if (r != null ) {
    r.setAttribute('style','display:none;'); }
  }

}
