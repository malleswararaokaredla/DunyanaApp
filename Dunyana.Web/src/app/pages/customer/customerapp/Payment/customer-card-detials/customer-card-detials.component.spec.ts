import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCardDetialsComponent } from './customer-card-detials.component';

describe('CustomerCardDetialsComponent', () => {
  let component: CustomerCardDetialsComponent;
  let fixture: ComponentFixture<CustomerCardDetialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerCardDetialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerCardDetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
