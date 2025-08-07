import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopFormComponent } from './workshop-form.component';

describe('WorkshopFormComponent', () => {
  let component: WorkshopFormComponent;
  let fixture: ComponentFixture<WorkshopFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkshopFormComponent]
    });
    fixture = TestBed.createComponent(WorkshopFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
