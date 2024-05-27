import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersToMatchCardComponent } from './users-to-match-card.component';

describe('UsersToMatchCardComponent', () => {
  let component: UsersToMatchCardComponent;
  let fixture: ComponentFixture<UsersToMatchCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersToMatchCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersToMatchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
