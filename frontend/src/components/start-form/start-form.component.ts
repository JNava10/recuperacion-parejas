import {Component, Input} from '@angular/core';
import {PreferenceItem, PreferenceList} from "../../interfaces/api/preference/preferenceItem";

@Component({
  selector: 'app-start-form',
  standalone: true,
  imports: [],
  templateUrl: './start-form.component.html',
  styleUrl: './start-form.component.css'
})
export class StartFormComponent {
  @Input() preferences?: PreferenceList;
}
