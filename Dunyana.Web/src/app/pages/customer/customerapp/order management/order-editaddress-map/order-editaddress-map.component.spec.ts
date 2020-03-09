import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditaddressMapComponent } from './order-editaddress-map.component';

describe('OrderEditaddressMapComponent', () => {
  let component: OrderEditaddressMapComponent;
  let fixture: ComponentFixture<OrderEditaddressMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderEditaddressMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderEditaddressMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
