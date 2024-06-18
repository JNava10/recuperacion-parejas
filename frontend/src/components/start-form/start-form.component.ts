import {Component, Input, OnInit} from '@angular/core';
import {
  ChoicePreference, Preference,
  PreferenceItem,
  PreferenceList, PreferenceValueFormItem,
  RangePreference, UserPreferenceItem
} from "../../interfaces/api/preference/preferenceItem";
import {NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {CustomToastComponent} from "../custom-toast/custom-toast.component";
import {UserService} from "../../services/api/user.service";
import {userPreferencesToFormGroup, showQueryToast, preferencesToFormGroup} from "../../utils/common.utils";
import {DialogModule} from "primeng/dialog";
import {TableModule} from "primeng/table";
import {PreferenceService} from "../../services/api/preference.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-start-form',
  standalone: true,
  imports: [
    TitleCasePipe,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    CustomToastComponent,
    DialogModule,
    TableModule
  ],
  templateUrl: './start-form.component.html',
  styleUrl: './start-form.component.css'
})
export class StartFormComponent implements OnInit {

  constructor(private userService: UserService, private messageService: MessageService, private preferenceService: PreferenceService, private router: Router) {
  }

  ngOnInit() {
    this.choicePreferencesForm = preferencesToFormGroup(this.preferences!.choice)
    this.rangePreferencesForm = preferencesToFormGroup(this.preferences!.range)
  }

  @Input() preferences?: PreferenceList
  choicePreferencesForm?: FormGroup
  rangePreferencesForm?: FormGroup
  confirmPreferences = false

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

    rangeValues.forEach(entry => {
      const preferenceId = entry[0];
      const preferenceValue = entry[1];

      ranges.push({preference: Number(preferenceId), value: Number(preferenceValue)})
    });

    const preferences = [...choices, ...ranges]

    this.preferenceService.createUserPreferences(preferences).subscribe(body => {
      if (body.data.errors) {
        body.data.errors.forEach(error => showQueryToast(body.data.executed, error, this.messageService))
      } else {
        showQueryToast(body.data.executed, body.message, this.messageService)
      }

      if (body.data.executed) {
        this.router.navigate(['/dashboard'])
      }
    })
  }

  showDialog = () => this.confirmPreferences = true
}
