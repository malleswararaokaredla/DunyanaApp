import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderingPaymentComponent } from './ordering-payment.component';

describe('OrderingPaymentComponent', () => {
  let component: OrderingPaymentComponent;
  let fixture: ComponentFixture<OrderingPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderingPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
