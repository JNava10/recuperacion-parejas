import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import * as regex from "../../../utils/const/regex.constants";
import MapMouseEvent = google.maps.MapMouseEvent;
import {DatePipe, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {GoogleMap, GoogleMapsModule} from '@angular/google-maps'
import {EventItem} from "../../../interfaces/api/event/event";
import {EventService} from "../../../services/api/event.service";
import {MapEventMarkerComponent} from "../map-event-marker/map-event-marker.component";
import LatLngLiteral = google.maps.LatLngLiteral;

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    NgIf,
    PaginatorModule,
    ReactiveFormsModule,
    DatePipe,
    GoogleMap,
    MapEventMarkerComponent
  ],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit {
  @Input() event?: EventItem;
  @Output() edited = new EventEmitter<boolean>();

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.patchValues(this.event!);
  }

  latLng: google.maps.LatLngLiteral = {
    lat: 38.69293623181963,
    lng: -4.108717751788397
  };

  private mapMarker?: google.maps.Marker;
  map?: google.maps.Map;
  center: google.maps.LatLngLiteral = this.latLng;

  editEventForm = new FormGroup({
    name: new FormControl(this.event?.name, {validators: [
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
  }, {updateOn: "submit"});

  editEventPlaceForm = new FormGroup({
    latLng: new FormControl(this.latLng, [Validators.required])
  }, {updateOn: "submit"});

  handleEditDetailsForm() {
    const {name, description, scheduledDate, scheduledTime} = this.editEventForm.value;
    if (!this.editEventForm.valid) return;

    const scheduledDateTime = new Date(`${scheduledDate} ${scheduledTime}`).toString();

    const eventDetails: EventItem = {
      name: name!,
      description: description!,
      scheduledDateTime: scheduledDateTime,
      id: this.event?.id
    }

    this.eventService.editEventDetails(eventDetails).subscribe(body => {
      this.edited.emit(body.data.executed)
    });
  }

  private patchValues = (event: EventItem) => {
    const scheduledDateTime = new Date(event.scheduledDateTime!);
    const scheduledDate = new DatePipe('en-US').transform(scheduledDateTime, 'YYYY-MM-dd')?.toString();
    const scheduledTime = new DatePipe('en-US').transform(scheduledDateTime, 'hh:ss')?.toString();

    this.editEventForm.patchValue({
      name: event.name,
      description: event.description,
      scheduledTime: scheduledTime,
      scheduledDate: scheduledDate,
    });
  }

  setPlaceValue = (latLng: google.maps.LatLngLiteral) => {
    this.editEventPlaceForm.setValue({latLng});
  };

  handleEditPlaceForm = () => {
    if (!this.editEventPlaceForm.valid) return;

    const {latLng} = this.editEventPlaceForm.value;

    const eventDetails: EventItem = {id: this.event?.id, latitude: latLng?.lat, longitude: latLng?.lng};

    this.eventService.editEventPlace(eventDetails).subscribe(body => {
      this.edited.emit(body.data.executed);
    });
  };

  getEventPos(): google.maps.LatLngLiteral | undefined {
    if (this.event?.latitude && this.event?.longitude) {
      return {lat: Number(this.event?.latitude), lng: Number(this.event?.longitude)}
    }

    else return undefined;
  }
}
