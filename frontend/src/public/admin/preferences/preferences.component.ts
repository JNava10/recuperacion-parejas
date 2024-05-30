import {Component, Input, OnInit} from '@angular/core';
import {PreferenceItem, PreferenceItemWithType} from "../../../interfaces/api/preference/preferenceItem";
import {PreferenceService} from "../../../services/api/preference.service";
import {TitleCasePipe} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    TitleCasePipe
  ],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent implements OnInit {
  constructor(private preferenceService: PreferenceService, private router: Router) {}

  ngOnInit() {
    this.preferenceService.getActivatedPreferences().subscribe(preferences => {
      this.preferences = preferences
      }
    )
  }

  @Input() preferences?: PreferenceItemWithType[];


  goToCreateChoicePreference = () => {
    this.router.navigate(['create-choice-preference'])
  };
}
