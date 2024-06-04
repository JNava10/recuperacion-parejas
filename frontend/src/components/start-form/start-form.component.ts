import {Component, Input, OnInit} from '@angular/core';
import {
  ChoicePreference,
  PreferenceItem,
  PreferenceList,
  RangePreference
} from "../../interfaces/api/preference/preferenceItem";
import {NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-start-form',
  standalone: true,
  imports: [
    TitleCasePipe,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './start-form.component.html',
  styleUrl: './start-form.component.css'
})
export class StartFormComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {
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
    console.log(this.startForm.valid)

    const preferences = [];

    for (const i in this.choices.value) {
      const {choice, id} = this.choices.value[i];

      preferences.push({id, value: choice});
    }

    for (const i in this.ranges.value) {
      const {rangeValue, id} = this.ranges.value[i];

      preferences.push({id, value: rangeValue});
    }

    console.log(preferences)
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
