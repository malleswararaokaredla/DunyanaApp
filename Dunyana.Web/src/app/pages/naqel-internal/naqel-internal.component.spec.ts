import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaqelInternalComponent } from './naqel-internal.component';

describe('NaqelInternalComponent', () => {
  let component: NaqelInternalComponent;
  let fixture: ComponentFixture<NaqelInternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaqelInternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaqelInternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
