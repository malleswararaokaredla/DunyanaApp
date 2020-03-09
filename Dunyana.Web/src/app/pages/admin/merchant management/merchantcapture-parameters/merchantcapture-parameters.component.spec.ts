import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantcaptureParametersComponent } from './merchantcapture-parameters.component';

describe('MerchantcaptureParametersComponent', () => {
  let component: MerchantcaptureParametersComponent;
  let fixture: ComponentFixture<MerchantcaptureParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantcaptureParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantcaptureParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
