import {Component, Input, OnInit} from '@angular/core';
import {StartFormComponent} from "../../components/start-form/start-form.component";
import {PreferenceItem, PreferenceList} from "../../interfaces/api/preference/preferenceItem";
import {PreferenceService} from "../../services/api/preference.service";

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [
    StartFormComponent
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements OnInit {
  constructor(private preferenceService: PreferenceService) {
  }

  ngOnInit() {
    this.preferenceService.getAllPreferences().subscribe(preferences => {
      this.preferences = preferences
    })
  }

  preferences?: PreferenceList
}
