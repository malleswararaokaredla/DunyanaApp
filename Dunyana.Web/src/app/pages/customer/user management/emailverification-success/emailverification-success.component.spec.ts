import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailverificationSuccessComponent } from './emailverification-success.component';

describe('EmailverificationSuccessComponent', () => {
  let component: EmailverificationSuccessComponent;
  let fixture: ComponentFixture<EmailverificationSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailverificationSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailverificationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
