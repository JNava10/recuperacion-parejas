import {Component, Input, OnInit} from '@angular/core';
import {ChoicePreference, PreferenceList} from "../../interfaces/api/preference/preferenceItem";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-profile-edit-preferences-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-profile-preferences-form.component.html',
  styleUrl: './edit-profile-preferences-form.component.css'
})
export class EditProfilePreferencesFormComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.preferences?.choice.forEach(preference => {
      this.createChoicePreference(preference)
    })
  }

  @Input() preferences?: PreferenceList

  choicePreferencesForm = this.formBuilder.group({
    preferences: this.formBuilder.array([])
  });

  get choicePreferences() {
    return this.choicePreferencesForm.get('preferences') as FormArray;
  }

  createChoicePreference = (preference: ChoicePreference) => {
    this.choicePreferences.push(
      this.formBuilder.group({
        id: preference.id,
        value: [preference.userValues?.value, [Validators.required]]
      })
    )
  }
}
