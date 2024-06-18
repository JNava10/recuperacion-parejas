import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import * as regex from "../../../utils/const/regex.constants";

import {DatePipe, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {GoogleMap, GoogleMapsModule} from '@angular/google-maps'
import {CreateEventItem, EventItem, EventResponse} from "../../../interfaces/api/event/event";
import {EventService} from "../../../services/api/event.service";
import {MapEventMarkerComponent} from "../map-event-marker/map-event-marker.component";

import {Message, MessageService} from 'primeng/api';
import {getQueryToast, showQueryToast, validateFiles} from '../../../utils/common.utils';
import { CustomToastComponent } from "../../custom-toast/custom-toast.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {closeDateIsValid, dateIsNotPast} from "../../../utils/validators/customValidators";

@Component({
    selector: 'app-edit-event',
    standalone: true,
    templateUrl: './edit-event.component.html',
    styleUrl: './edit-event.component.css',
  imports: [
    NgIf,
    PaginatorModule,
    ReactiveFormsModule,
    DatePipe,
    GoogleMap,
    MapEventMarkerComponent,
    CustomToastComponent,
    MatProgressSpinner
  ]
})
export class EditEventComponent implements OnInit {
  @Input() event?: EventItem;
  @Output() edited = new EventEmitter<boolean>();

  constructor(private eventService: EventService, private messageService: MessageService) {}

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

  protected picFile?: File;
  loading = false;

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

    closeDate: new FormControl('', [
      Validators.required, Validators.pattern(regex.event.scheduledDate)
    ]),

    closeTime: new FormControl('', [
      Validators.required, Validators.pattern(regex.event.scheduledTime)
    ]),
  }, {updateOn: "change", validators:[closeDateIsValid('scheduledDate', 'closeDate'), dateIsNotPast('scheduledDate', 'closeDate')]});

  editEventPlaceForm = new FormGroup({
    latLng: new FormControl(this.latLng, [Validators.required])
  }, {updateOn: "change"});

  handleEditDetailsForm() {
    const {name, description, scheduledDate, scheduledTime, closeTime, closeDate} = this.editEventForm.value;
    if (!this.editEventForm.valid) return;

    const scheduledDateTime = new Date(`${scheduledDate} ${scheduledTime}`).toString();
    const closeDateTime = new Date(`${closeDate} ${closeTime}`).toString();

    const eventDetails: EventItem = {
      name: name!,
      description: description!,
      scheduledDateTime: scheduledDateTime,
      closeDateTime: closeDateTime,
      id: this.event?.id
    }

    this.eventService.editEventDetails(eventDetails).subscribe(body => {
      this.loading = true;

      if (body.data.errors) {
        body.data.errors.forEach(error => showQueryToast(body.data.executed, error, this.messageService))
      } else {
        showQueryToast(body.data.executed, body.message, this.messageService)
      }

      if (this.picFile) {
        this.updatePic();
      } else {
        if (body.data.errors) {
          body.data.errors.forEach(error => showQueryToast(body.data.executed, error, this.messageService))
        } else {
          showQueryToast(body.data.executed, body.message, this.messageService)
        }

        this.edited.emit(body.data.executed);

      }
    });
  }

  private patchValues = (event: EventItem) => {
    const scheduledDateTime = new Date(event.scheduledDateTime!);
    const closeDateTime = new Date(event.closeDateTime!);
    const scheduledDate = new DatePipe('en-US').transform(scheduledDateTime, 'YYYY-MM-dd')?.toString();
    const scheduledTime = new DatePipe('en-US').transform(scheduledDateTime, 'hh:ss')?.toString();
    const closeDate = new DatePipe('en-US').transform(closeDateTime, 'YYYY-MM-dd')?.toString();
    const closeTime = new DatePipe('en-US').transform(closeDateTime, 'hh:ss')?.toString();

    this.editEventForm.patchValue({
      name: event.name,
      description: event.description,
      scheduledTime: scheduledTime,
      scheduledDate: scheduledDate,
      closeTime: closeTime,
      closeDate: closeDate,
    });
  }

  setPlaceValue = (latLng: google.maps.LatLngLiteral) => {
    this.editEventPlaceForm.patchValue({latLng});
  };

  handleEditPlaceForm = () => {
    if (!this.editEventPlaceForm.valid) return;

    const {latLng} = this.editEventPlaceForm.value;

    const eventDetails: EventItem = {id: this.event?.id, latitude: latLng?.lat, longitude: latLng?.lng};

    this.eventService.editEventPlace(eventDetails).subscribe(body => {
      if (body.data.errors) {
        body.data.errors.forEach(error => showQueryToast(body.data.executed, error, this.messageService))
      } else {
        showQueryToast(body.data.executed, body.message, this.messageService)
      }
    });
  };

  private updatePic() {
    this.eventService.updateEventPic(this.event?.id!, this.picFile!).subscribe(body => {
      if (body.data.errors) {
        body.data.errors.forEach(error => showQueryToast(body.data.executed, error, this.messageService))
      } else {
        showQueryToast(body.data.executed, body.message, this.messageService)
      }

      this.edited.emit(body.data.executed);
    })
  }

  getEventPos(): google.maps.LatLngLiteral | undefined {
    if (this.event?.latitude && this.event?.longitude) {
      return {lat: Number(this.event?.latitude), lng: Number(this.event?.longitude)}
    }

    else return undefined;
  }

  protected handleFile = async ($event: Event) => {
    const input = $event.target as HTMLInputElement;

    const file = input.files?.item(0);

    if (file) {
      const valid = validateFiles([file], {maxCount: 4, maxSizeMb: 1}, this.messageService)

      if (!valid) return;
      this.picFile = file
    }
  };
}
