import {Component, Input, OnInit} from '@angular/core';
import {
  ChoicePreference,
  PreferenceItem,
  PreferenceList,
  RangePreference, UserPreferenceItem
} from "../../interfaces/api/preference/preferenceItem";
import {NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PreferenceService} from "../../services/api/preference.service";
import {MessageService} from "primeng/api";
import {CustomToastComponent} from "../custom-toast/custom-toast.component";

@Component({
  selector: 'app-start-form',
  standalone: true,
  imports: [
    TitleCasePipe,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    CustomToastComponent
  ],
  templateUrl: './start-form.component.html',
  styleUrl: './start-form.component.css'
})
export class StartFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private preferenceService: PreferenceService, private messageService: MessageService,) {
  }

  ngOnInit() {
    this.preferences?.choice.forEach(choicePref => {
      this.choices.push(
        this.formBuilder.group({
          id: choicePref.id,
          name: choicePref.name,
          description: choicePref.description,
          options: this.formBuilder.array(choicePref.options!),
          choice: this.formBuilder.control("", [Validators.required, Validators.pattern(/[0-9]$/)])
        })
      )
    });

    this.preferences?.range.forEach(rangePref => {
      this.ranges.push(
        this.formBuilder.group({
          id: rangePref.id,
          name: rangePref.name,
          description: rangePref.description,
          minValue: rangePref.values?.min_value,
          maxValue: rangePref.values?.max_value,
          rangeValue: this.formBuilder.control("", [Validators.required, Validators.min(Number(rangePref.values?.min_value)), Validators.max(Number(rangePref.values?.max_value))])
        })
      )
    });
  }

  @Input() preferences?: PreferenceList;

  startForm = this.formBuilder.group({
    choices: this.formBuilder.array([]),
    ranges: this.formBuilder.array([]),
  }, {updateOn: "change"});

  get choices(): FormArray {
    return this.startForm.get('choices') as FormArray;
  }

  get ranges(): FormArray {
    return this.startForm.get('ranges') as FormArray;
  }

  submitStartPreferences = () => {
    const preferences: UserPreferenceItem[] = [];

    for (const i in this.choices.value) {
      const {choice, id} = this.choices.value[i];

      preferences.push({preference: id, value: choice});
    }

    for (const i in this.ranges.value) {
      const {rangeValue, id} = this.ranges.value[i];

      preferences.push({preference: id, value: rangeValue});
    }

    this.preferenceService.createUserPreferences(preferences).subscribe(body => {

      if (body.data.executed) {
        this.messageService.add({summary: 'Exito', detail: body.message, severity: 'success'});
      } else {
        this.messageService.add({summary: 'Error', detail: body.message, severity: 'error'});
      }
    })
  };

  setChoice($event: Event, i: number) {
    const target  = $event.target as HTMLSelectElement;

    this.choices.controls[i].get('choice')?.setValue(target.value)
  }

  setRange($event: Event, i: number) {
    const target  = $event.target as HTMLInputElement;

    this.ranges.controls[i].get('rangeValue')?.setValue(target.value)
  }

}
