import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-order-editaddress-map',
  templateUrl: './order-editaddress-map.component.html',
  styleUrls: ['./order-editaddress-map.component.scss']
})
export class OrderEditaddressMapComponent implements OnInit {

  @Input() display: boolean;
  @Output() displayChange = new EventEmitter();
  
  lat: number = 17.6868;
  lng: number = 83.2185;
  
  constructor() { }

  ngOnInit() {
  }
  onClose(){
    this.displayChange.emit(false);
  }
}
