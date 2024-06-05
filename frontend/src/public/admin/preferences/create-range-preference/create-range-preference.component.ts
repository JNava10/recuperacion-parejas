import { Component } from '@angular/core';
import {
  CreateRangePreferenceFormComponent
} from "../../../../components/preferences/create-range-preference-form/create-range-preference-form.component";

@Component({
  selector: 'app-create-range-preference',
  standalone: true,
  imports: [
    CreateRangePreferenceFormComponent
  ],
  templateUrl: './create-range-preference.component.html',
  styleUrl: './create-range-preference.component.css'
})
export class CreateRangePreferenceComponent {

}
