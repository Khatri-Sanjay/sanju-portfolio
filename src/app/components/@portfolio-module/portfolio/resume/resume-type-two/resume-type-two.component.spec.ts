import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeTypeTwoComponent } from './resume-type-two.component';

describe('ResumeTypeTwoComponent', () => {
  let component: ResumeTypeTwoComponent;
  let fixture: ComponentFixture<ResumeTypeTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeTypeTwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeTypeTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
