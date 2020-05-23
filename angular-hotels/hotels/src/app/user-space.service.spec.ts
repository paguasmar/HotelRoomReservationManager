/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserSpaceService } from './user-space.service';

describe('Service: UserSpace', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserSpaceService]
    });
  });

  it('should ...', inject([UserSpaceService], (service: UserSpaceService) => {
    expect(service).toBeTruthy();
  }));
});
