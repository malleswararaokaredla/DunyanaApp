import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantCreditListComponent } from './merchant-credit-list.component';

describe('MerchantCreditListComponent', () => {
  let component: MerchantCreditListComponent;
  let fixture: ComponentFixture<MerchantCreditListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantCreditListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantCreditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
