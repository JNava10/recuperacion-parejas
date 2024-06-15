import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventMembersFormComponent } from './manage-event-members-form.component';

describe('ManageEventMembersFormComponent', () => {
  let component: ManageEventMembersFormComponent;
  let fixture: ComponentFixture<ManageEventMembersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEventMembersFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageEventMembersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
