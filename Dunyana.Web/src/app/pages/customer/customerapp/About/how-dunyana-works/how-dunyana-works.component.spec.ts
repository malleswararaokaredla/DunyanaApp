import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowDunyanaWorksComponent } from './how-dunyana-works.component';

describe('HowDunyanaWorksComponent', () => {
  let component: HowDunyanaWorksComponent;
  let fixture: ComponentFixture<HowDunyanaWorksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowDunyanaWorksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowDunyanaWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
