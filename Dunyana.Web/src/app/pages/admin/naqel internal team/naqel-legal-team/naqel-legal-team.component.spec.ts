import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaqelLegalTeamComponent } from './naqel-legal-team.component';

describe('NaqelLegalTeamComponent', () => {
  let component: NaqelLegalTeamComponent;
  let fixture: ComponentFixture<NaqelLegalTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaqelLegalTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaqelLegalTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
