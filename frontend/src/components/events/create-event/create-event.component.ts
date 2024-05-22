import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {EventService} from "../../../services/api/event.service";
import {} from "googlemaps";
import MapMouseEvent = google.maps.MapMouseEvent;
import * as regex from '../../../utils/const/regex.constants';
import {NgIf} from "@angular/common";
import {EventItem} from "../../../interfaces/api/event/event";
import {MapEventMarkerComponent} from "../map-event-marker/map-event-marker.component";

let latLng = {
  "lat": 38.69293623181963,
  "lng": -4.108717751788397
};

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CalendarModule,
    NgIf,
    MapEventMarkerComponent
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  constructor(private eventService: EventService) {}

  static modalId = "create-event-modal";

  private mapMarker?: google.maps.Marker;

  // Esto es necesario para poder mostrar el mapa.
  map?: google.maps.Map;
  center: google.maps.LatLngLiteral = latLng;

  createEventForm = new FormGroup({
    name: new FormControl('', {validators: [
        Validators.required, Validators.pattern(regex.event.name),
      ], updateOn: "submit"}),

    description: new FormControl('', [
      Validators.required, Validators.pattern(regex.event.description)
    ]),

    scheduledDate: new FormControl('', [
      Validators.required, Validators.pattern(regex.event.scheduledDate)
    ]),

    scheduledTime: new FormControl('', [
      Validators.required, Validators.pattern(regex.event.scheduledTime)
    ]),

    latLng: new FormControl({lat: 0, lng: 0}, [Validators.required])
  }, {updateOn: "submit"});

  @Output() created = new EventEmitter<boolean>();

  handleCreateForm = (mouseEvent: MouseEvent) => {
    const validations = {
      name: regex.event.name.test(this.createEventForm.value.name!),
      description: regex.event.description.test(this.createEventForm.value.description!),
      scheduledDate: regex.event.scheduledDate.test(this.createEventForm.value.scheduledDate!),
    }

    console.table(validations)
    if (!this.createEventForm.valid) return

    const createBtn = mouseEvent.target as Element;

    createBtn.setAttribute('data-modal-hide', CreateEventComponent.modalId);

    const formData = this.createEventForm.value;
    const scheduledDateTime = `${formData.scheduledDate} ${formData.scheduledTime}`;

    const event: EventItem = {
      name: formData.name!,
      description: formData.description!,
      scheduledDateTime: scheduledDateTime!,
      picUrl: "https://cdn-9.motorsport.com/images/amp/YpNpMWJ0/s1000/ferrari-f1-75-con-paraspruzzi.jpg",
      summaryUrl: "https://www.fia.com/sites/default/files/fia_2024_formula_1_technical_regulations_-_issue_1_-_2023-04-25.pdf" ,
      latitude: 10.1,
      longitude: 10.2
    }

    this.eventService.createEvent(event).subscribe(body => {
      this.created.emit(body.data.executed)
    })
  };
}
