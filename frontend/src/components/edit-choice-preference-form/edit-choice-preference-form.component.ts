import {Component, Input, OnInit} from '@angular/core';
import {ChoicePreference, CreateChoicePreferenceItem} from "../../interfaces/api/preference/preferenceItem";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import * as regex from "../../utils/const/regex.constants";
import {PreferenceService} from "../../services/api/preference.service";

@Component({
  selector: 'app-edit-choice-preference-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './edit-choice-preference-form.component.html',
  styleUrl: './edit-choice-preference-form.component.css'
})
export class EditChoicePreferenceFormComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private preferenceService: PreferenceService) {
  }

  ngOnInit() {
    this.patchValues(this.preference!)
  }

  private patchValues = (preference: ChoicePreference) => {
    this.choicePreferenceForm.patchValue({
      name: preference.name,
      description: preference.description,
    })
  }

  @Input() preference?: ChoicePreference

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
    if (this.choicePreferenceForm.invalid) return;

    const formValues = this.choicePreferenceForm.value;

    const choicePreference: CreateChoicePreferenceItem = {
      name: formValues.name!,
      description: formValues.description!,
      options: this.options.value,
    }

    this.preferenceService.saveChoicePreference(choicePreference).subscribe()
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
    this.options.removeAt(index)
  }

  minOptionsRequired = 2;

  protected createOption() {
    const optionForm = this.formBuilder.group({
      text: ["", Validators.required]
    }, {updateOn: "change"});

    this.options.push(optionForm)
  }
}
