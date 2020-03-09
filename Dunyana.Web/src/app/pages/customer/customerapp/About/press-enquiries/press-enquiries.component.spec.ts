import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PressEnquiriesComponent } from './press-enquiries.component';

describe('PressEnquiriesComponent', () => {
  let component: PressEnquiriesComponent;
  let fixture: ComponentFixture<PressEnquiriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PressEnquiriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PressEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
