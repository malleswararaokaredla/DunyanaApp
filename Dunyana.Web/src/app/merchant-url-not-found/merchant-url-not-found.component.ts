import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-merchant-url-not-found',
  templateUrl: './merchant-url-not-found.component.html',
  styleUrls: ['./merchant-url-not-found.component.scss']
})
export class MerchantUrlNotFoundComponent implements OnInit {

  @Input() display: boolean;
  @Output() displayChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  onClose() {
    this.displayChange.emit(false);
  }
}
