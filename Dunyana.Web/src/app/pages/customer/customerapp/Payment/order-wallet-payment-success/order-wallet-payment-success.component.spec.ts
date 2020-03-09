import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWalletPaymentSuccessComponent } from './order-wallet-payment-success.component';

describe('OrderWalletPaymentSuccessComponent', () => {
  let component: OrderWalletPaymentSuccessComponent;
  let fixture: ComponentFixture<OrderWalletPaymentSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderWalletPaymentSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWalletPaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
