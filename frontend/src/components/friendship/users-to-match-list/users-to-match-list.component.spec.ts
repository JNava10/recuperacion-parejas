import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersToMatchListComponent } from './users-to-match-list.component';

describe('UsersToMatchListComponent', () => {
  let component: UsersToMatchListComponent;
  let fixture: ComponentFixture<UsersToMatchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersToMatchListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersToMatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
