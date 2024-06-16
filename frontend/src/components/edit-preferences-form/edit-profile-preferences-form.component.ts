import {Component, Input, OnInit} from '@angular/core';
import {
  ChoicePreference,
  PreferenceList, PreferenceValue, PreferenceValueFormItem, RangePreference
} from "../../interfaces/api/preference/preferenceItem";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {SliderModule} from "primeng/slider";
import {InputTextModule} from "primeng/inputtext";
import {userPreferencesToFormGroup, showQueryToast} from "../../utils/common.utils";
import {UserService} from "../../services/api/user.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-profile-edit-preferences-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SliderModule,
    FormsModule,
    InputTextModule
  ],
  templateUrl: './edit-profile-preferences-form.component.html',
  styleUrl: './edit-profile-preferences-form.component.css'
})
export class EditProfilePreferencesFormComponent implements OnInit {
  constructor(private userService: UserService, private messageService: MessageService) {
  }

  ngOnInit() {
    this.choicePreferencesForm = userPreferencesToFormGroup(this.preferences!.choice)
    this.rangePreferencesForm = userPreferencesToFormGroup(this.preferences!.range)
  }

  @Input() preferences?: PreferenceList
  choicePreferencesForm?: FormGroup
  rangePreferencesForm?: FormGroup

  getPreferencesFormData = () => {
    const choiceValues =  Object.entries(this.choicePreferencesForm?.value);
    const rangeValues =  Object.entries(this.rangePreferencesForm?.value);


    const choices: PreferenceValueFormItem[] = []
    const ranges: PreferenceValueFormItem[] = []

    choiceValues.forEach(entry => {
      const preferenceId = entry[0];
      const preferenceValue = entry[1];

      choices.push({preference: Number(preferenceId), value: Number(preferenceValue)})
    });

    console.log(choices)

    rangeValues.forEach(entry => {
      const preferenceId = entry[0];
      const preferenceValue = entry[1];

      ranges.push({preference: Number(preferenceId), value: Number(preferenceValue)})
    });

    const preferences = [...choices, ...ranges]

    this.userService.updateOwnPreferences(preferences).subscribe(body => {
      showQueryToast(body.data.executed, body.message, this.messageService)
    })
  }
}
