import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentExceptionComponent } from './payment-exception.component';

describe('PaymentExceptionComponent', () => {
  let component: PaymentExceptionComponent;
  let fixture: ComponentFixture<PaymentExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
