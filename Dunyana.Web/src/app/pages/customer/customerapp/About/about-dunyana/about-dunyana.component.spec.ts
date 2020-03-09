import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutDunyanaComponent } from './about-dunyana.component';

describe('AboutDunyanaComponent', () => {
  let component: AboutDunyanaComponent;
  let fixture: ComponentFixture<AboutDunyanaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutDunyanaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutDunyanaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
