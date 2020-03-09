import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantUrlNotFoundComponent } from './merchant-url-not-found.component';

describe('MerchantUrlNotFoundComponent', () => {
  let component: MerchantUrlNotFoundComponent;
  let fixture: ComponentFixture<MerchantUrlNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantUrlNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantUrlNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
