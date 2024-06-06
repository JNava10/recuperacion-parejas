import {Component, OnInit} from '@angular/core';
import {EditChoicePreferenceFormComponent} from "../edit-choice-preference-form/edit-choice-preference-form.component";
import {ActivatedRoute} from "@angular/router";
import {PreferenceService} from "../../services/api/preference.service";
import {ChoicePreference, GetPreferenceResponse, RangePreference} from "../../interfaces/api/preference/preferenceItem";

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

  preferenceNotExists = false;

  ngOnInit() {
    const preferenceId = Number(this.activatedRoute.snapshot.queryParams['id']);

    this.preferenceService.getPreference(preferenceId).subscribe(body => {
      if (!body.data.query) {
        this.preferenceNotExists = true;
        return
      }

      console.log(body)

      if (body.data.query.choice) {
        this.choicePreference = body.data.query.choice
      } else if (body.data.query.range) {
        this.rangePreference = body.data.query.range
      }

      console.log(this.choicePreference)

      this.preferenceFetched = true
    })
  }


// Dependiendo del tipo de preferencia que sea, se inicializará un tipo u otro.
  choicePreference?: ChoicePreference;
  rangePreference?: RangePreference;

  preferenceFetched = false;
}
