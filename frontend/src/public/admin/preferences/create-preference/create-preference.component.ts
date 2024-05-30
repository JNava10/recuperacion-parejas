import { Component } from '@angular/core';
import {
  CreateChoicePreferenceFormComponent
} from "../../../../components/preferences/create-preference-form/create-choice-preference-form.component";
import {MapEventMarkerComponent} from "../../../../components/events/map-event-marker/map-event-marker.component";
import {NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-create-preference',
  standalone: true,
  imports: [
    CreateChoicePreferenceFormComponent,
    MapEventMarkerComponent,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './create-preference.component.html',
  styleUrl: './create-preference.component.css'
})
export class CreatePreferenceComponent {

}
