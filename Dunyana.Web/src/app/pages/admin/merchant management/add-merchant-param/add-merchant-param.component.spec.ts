import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMerchantParamComponent } from './add-merchant-param.component';

describe('AddMerchantParamComponent', () => {
  let component: AddMerchantParamComponent;
  let fixture: ComponentFixture<AddMerchantParamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMerchantParamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMerchantParamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
