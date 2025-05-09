import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLearningComponent } from './user-learning.component';

describe('UserLearningComponent', () => {
  let component: UserLearningComponent;
  let fixture: ComponentFixture<UserLearningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserLearningComponent]
    });
    fixture = TestBed.createComponent(UserLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
