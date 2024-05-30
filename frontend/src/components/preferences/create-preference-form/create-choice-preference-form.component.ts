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

  choicePreferenceForm = new FormGroup({
    name: new FormControl('', {validators: [
        Validators.required, Validators.pattern(regex.event.name),
      ]}),

    description: new FormControl('', [
      Validators.required, Validators.pattern(regex.event.description)
    ]),
  }, {updateOn: "submit"});

  optionsFormGroup = this.formBuilder.group({
    options: this.formBuilder.array([])
  });

  optionFields = 1;

  handleForm($event: MouseEvent) {
    const formValues = this.choicePreferenceForm.value;
    const options = this.getOptionsFromForm()


    // const choicePreference: CreateChoicePreference = {
    //   name: formValues.name!,
    //   description: formValues.description!,
    //   options: options,
    // }
  }

  private getOptionsFromForm = () => {
    const controls = this.optionsFormGroup.controls;

    console.log(controls)
  };

  createPreferenceOptions = () => {
    for (let i = 0; i < this.optionFields; i++) {
     this.createOption();
    }
  }

  // Con get se puede acceder al formulario de forma dinamica.
  get options() {
    return this.optionsFormGroup.controls.options as FormArray;
  };

  protected removeOption = (index: number) => {
    console.log(index)
    this.options.removeAt(index);
  }

  protected createOption() {
    this.options.push(
      new FormControl("", Validators.required)
    )

    console.log(this.options.controls)
  }

  private getName(index: number) {
    return `option_${index}`;
  }
}
