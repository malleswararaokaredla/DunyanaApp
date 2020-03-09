import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalRequirementsComponent } from './legal-requirements.component';

describe('LegalRequirementsComponent', () => {
  let component: LegalRequirementsComponent;
  let fixture: ComponentFixture<LegalRequirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalRequirementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
