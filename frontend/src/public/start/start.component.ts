import {Component, Input, OnInit} from '@angular/core';
import {StartFormComponent} from "../../components/start-form/start-form.component";
import {PreferenceItem, PreferenceList} from "../../interfaces/api/preference/preferenceItem";
import {PreferenceService} from "../../services/api/preference.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [
    StartFormComponent,
    AsyncPipe
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements OnInit {
  constructor(private preferenceService: PreferenceService) {
  }

  ngOnInit() {
    this.preferenceService.getAllPreferences().subscribe(body => {
      this.preferences = body.data.query
    })
  }

  preferences?: PreferenceList
}
