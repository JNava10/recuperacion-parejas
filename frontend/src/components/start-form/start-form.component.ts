import {Component, Input} from '@angular/core';
import {PreferenceItem, PreferenceList} from "../../interfaces/api/preference/preferenceItem";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-start-form',
  standalone: true,
  imports: [
    TitleCasePipe
  ],
  templateUrl: './start-form.component.html',
  styleUrl: './start-form.component.css'
})
export class StartFormComponent {
  @Input() preferences?: PreferenceList;

  submitStartPreferences = () => {

  };
}
