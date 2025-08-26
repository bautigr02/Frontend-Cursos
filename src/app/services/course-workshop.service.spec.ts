import { TestBed } from '@angular/core/testing';

import { CourseWorkshopService } from './course-workshop.service';

describe('CourseWorkshopService', () => {
  let service: CourseWorkshopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CourseWorkshopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
