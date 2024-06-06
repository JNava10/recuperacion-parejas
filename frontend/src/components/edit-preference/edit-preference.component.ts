import {Component, OnInit} from '@angular/core';
import {EditChoicePreferenceFormComponent} from "../edit-choice-preference-form/edit-choice-preference-form.component";
import {ActivatedRoute} from "@angular/router";
import {PreferenceService} from "../../services/api/preference.service";
import {ChoicePreference, RangePreference} from "../../interfaces/api/preference/preferenceItem";

@Component({
  selector: 'app-edit-preference',
  standalone: true,
  imports: [
    EditChoicePreferenceFormComponent
  ],
  templateUrl: './edit-preference.component.html',
  styleUrl: './edit-preference.component.css'
})
export class EditPreferenceComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute, private preferenceService: PreferenceService) {}

  // Dependiendo del tipo de preferencia que sea, se inicializará un tipo u otro.
  choicePreference?: ChoicePreference;
  rangePreference?: RangePreference;

  ngOnInit() {
    this.preferenceService.getPreference()
  }
}
