import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaqelContractTeamComponent } from './naqel-contract-team.component';

describe('NaqelContractTeamComponent', () => {
  let component: NaqelContractTeamComponent;
  let fixture: ComponentFixture<NaqelContractTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaqelContractTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaqelContractTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
