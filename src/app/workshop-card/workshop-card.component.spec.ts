import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopCardComponent } from './workshop-card.component';

describe('WorkshopCardComponent', () => {
  let component: WorkshopCardComponent;
  let fixture: ComponentFixture<WorkshopCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkshopCardComponent]
    });
    fixture = TestBed.createComponent(WorkshopCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
