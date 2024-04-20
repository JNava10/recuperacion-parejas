import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMembersComponent } from './find-members.component';

describe('FindMembersComponent', () => {
  let component: FindMembersComponent;
  let fixture: ComponentFixture<FindMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindMembersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FindMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
