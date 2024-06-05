import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateChoicePreferenceFormComponent } from './create-choice-preference-form.component';

describe('CreatePreferenceFormComponent', () => {
  let component: CreateChoicePreferenceFormComponent;
  let fixture: ComponentFixture<CreateChoicePreferenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateChoicePreferenceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateChoicePreferenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
