import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantEditProfileComponent } from './merchant-edit-profile.component';

describe('MerchantEditProfileComponent', () => {
  let component: MerchantEditProfileComponent;
  let fixture: ComponentFixture<MerchantEditProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantEditProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
