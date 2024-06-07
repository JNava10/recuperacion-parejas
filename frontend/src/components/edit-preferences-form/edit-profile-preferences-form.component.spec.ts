import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfilePreferencesFormComponent } from './edit-profile-preferences-form.component';

describe('EditPreferencesFormComponent', () => {
  let component: EditProfilePreferencesFormComponent;
  let fixture: ComponentFixture<EditProfilePreferencesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfilePreferencesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfilePreferencesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
