import {Component, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {NgIf} from "@angular/common";
import {PreferenceService} from "../../../services/api/preference.service";
import * as regex from "../../../utils/const/regex.constants";
import {CreateRangePreferenceItem} from "../../../interfaces/api/preference/preferenceItem";
import {rangeValidation} from "../../../utils/validators/customValidators";
import {getQueryToast, showQueryToast} from "../../../utils/common.utils";
import {MessageService} from "primeng/api";
import {CustomToastComponent} from "../../custom-toast/custom-toast.component";

@Component({
  selector: 'app-create-range-preference-form',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    CustomToastComponent
  ],
  templateUrl: './create-range-preference-form.component.html',
  styleUrl: './create-range-preference-form.component.css'
})
export class CreateRangePreferenceFormComponent {
  constructor(private formBuilder: FormBuilder, private preferenceService: PreferenceService, private messageService: MessageService) {}

  rangePreferenceForm = this.formBuilder.group({
    name: ['', {
      validators: [
        Validators.required, Validators.pattern(regex.preference.name),
      ]
    }],

    description: ['', {
      validators: [
        Validators.required, Validators.pattern(regex.preference.description),
      ]
    }],

    min: new FormControl(0, {
      validators: [Validators.required, Validators.min(1), Validators.max(99)],
    }),
    max: new FormControl(0, {
      validators: [Validators.required, Validators.min(2), Validators.max(100)],
    }),
  }, {updateOn: "submit", validators: rangeValidation('min', 'max')});

  handleForm($event: SubmitEvent) {
    if (this.rangePreferenceForm.invalid) return;

    const formValues = this.rangePreferenceForm.value;

    const rangePreference: CreateRangePreferenceItem = {
      name: formValues.name!,
      description: formValues.description!,
      range: {
        min: formValues.min!,
        max: formValues.max!
      }
    }

    this.preferenceService.saveRangePreference(rangePreference).subscribe(body => {
      if (body.data.errors) {
        body.data.errors.forEach(error => showQueryToast(body.data.executed, error, this.messageService))
      } else {
        showQueryToast(body.data.executed, body.message, this.messageService)
      }
    })
  }
}
