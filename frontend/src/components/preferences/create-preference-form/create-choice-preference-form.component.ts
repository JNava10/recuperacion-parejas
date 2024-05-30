import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import * as regex from "../../../utils/const/regex.constants";
import {NgIf} from "@angular/common";
import {
  CreateChoicePreference,
  CreatePreferenceItem,
  PreferenceOption
} from "../../../interfaces/api/preference/preferenceItem";

@Component({
  selector: 'app-create-preference-form',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './create-choice-preference-form.component.html',
  styleUrl: './create-choice-preference-form.component.css'
})
export class CreateChoicePreferenceFormComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.createPreferenceOptions()
  }

  choicePreferenceForm = this.formBuilder.group({
    name: ['', {
      validators: [
        Validators.required, Validators.pattern(regex.event.name),
      ]
    }],

    description: ['', {
        validators: [
          Validators.required, Validators.pattern(regex.event.name),
        ]
      }],

    options: this.formBuilder.array(new Array<FormGroup>())
  }, {updateOn: "submit"});

  optionFields = 1;

  handleForm($event: MouseEvent) {
    const formValues = this.choicePreferenceForm.value;


    // const choicePreference: CreateChoicePreference = {
    //   name: formValues.name!,
    //   description: formValues.description!,
    //   options: options,
    // }
  }
  createPreferenceOptions = () => {
    for (let i = 0; i < this.optionFields; i++) {
     this.createOption();
    }
  }

  // Con get se puede acceder al formulario de forma dinamica.
  get options(): FormArray<FormGroup> {
    return this.choicePreferenceForm.controls.options as FormArray;
  };

  protected removeOption = (index: number) => {
    console.log(index)
    this.options.removeAt(index)

    console.log(this.options.value)
  }

  protected createOption() {
    const optionForm = this.formBuilder.group({
      text: ["", Validators.required]
    }, {updateOn: "change"});

    this.options.push(optionForm)

    console.log(this.choicePreferenceForm.value.options)
  }

  test(formGroup: FormGroup) {
    console.log(formGroup.value)
    return "";
  }
}
