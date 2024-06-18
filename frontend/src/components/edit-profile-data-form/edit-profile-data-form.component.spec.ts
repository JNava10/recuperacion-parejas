import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileDataFormComponent } from './edit-profile-data-form.component';

describe('EditProfileDataFormComponent', () => {
  let component: EditProfileDataFormComponent;
  let fixture: ComponentFixture<EditProfileDataFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfileDataFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditProfileDataFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
