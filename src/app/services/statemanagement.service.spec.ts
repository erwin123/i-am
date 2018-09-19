import { TestBed, inject } from '@angular/core/testing';

import { StatemanagementService } from './statemanagement.service';

describe('StatemanagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatemanagementService]
    });
  });

  it('should be created', inject([StatemanagementService], (service: StatemanagementService) => {
    expect(service).toBeTruthy();
  }));
});
