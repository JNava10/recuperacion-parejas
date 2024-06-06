import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChoicePreferenceFormComponent } from './edit-choice-preference-form.component';

describe('EditPreferenceFormComponent', () => {
  let component: EditChoicePreferenceFormComponent;
  let fixture: ComponentFixture<EditChoicePreferenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditChoicePreferenceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditChoicePreferenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
