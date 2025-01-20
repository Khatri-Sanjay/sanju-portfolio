import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeTypeOneComponent } from './resume-type-one.component';

describe('ResumeTypeOneComponent', () => {
  let component: ResumeTypeOneComponent;
  let fixture: ComponentFixture<ResumeTypeOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeTypeOneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeTypeOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
