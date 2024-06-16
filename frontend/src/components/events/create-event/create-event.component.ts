import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {EventService} from "../../../services/api/event.service";
import {} from "googlemaps";
import * as regex from '../../../utils/const/regex.constants';
import {NgIf} from "@angular/common";
import {CreateEventItem, EventItem, ManageEventResponse} from "../../../interfaces/api/event/event";
import {MapEventMarkerComponent} from "../map-event-marker/map-event-marker.component";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {Message, MessageService} from "primeng/api";
import {showQueryToast, validateFiles} from "../../../utils/common.utils";
import {closeDateIsValid, dateIsNotPast} from "../../../utils/validators/customValidators";

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
    MapEventMarkerComponent,
    ProgressSpinnerModule
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {

  constructor(private eventService: EventService, private messageService: MessageService) {}

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

    closeDate: new FormControl('', [
      Validators.required, Validators.pattern(regex.event.scheduledDate)
    ]),

    closeTime: new FormControl('', [
      Validators.required, Validators.pattern(regex.event.scheduledTime)
    ]),

    latLng: new FormControl({lat: 0, lng: 0}, [Validators.required])
  }, {updateOn: "submit", validators: [closeDateIsValid('scheduledDate', 'closeDate'), dateIsNotPast('scheduledDate', 'closeDate')]}, );

  @Output() created = new EventEmitter<boolean>();

  handleCreateForm = (mouseEvent: SubmitEvent) => {
    if (!this.createEventForm.valid) return

    const createBtn = mouseEvent.target as Element;

    createBtn.setAttribute('data-modal-hide', CreateEventComponent.modalId);

    const formData = this.createEventForm.value;
    const scheduledDateTime = `${formData.scheduledDate} ${formData.scheduledTime}`;
    const closeDateTime = `${formData.closeDate} ${formData.closeTime}`;

    const event: CreateEventItem = {
      name: formData.name!,
      description: formData.description!,
      scheduledDateTime: scheduledDateTime!,
      closeDateTime: closeDateTime!,
      latitude: formData.latLng?.lat,
      longitude: formData.latLng?.lng
    }

    this.eventService.createEvent(event).subscribe(body => {
      if (this.picFile) {
        this.eventService.updateEventPic(body.data.query.id!, this.picFile!).subscribe(body => this.handleUpdatingPic(body));
      }

      showQueryToast(body.data.executed, body.message, this.messageService)

      this.created.emit(body.data.executed)
    })
  };

  protected handleFile = async ($event: Event) => {
    const input = $event.target as HTMLInputElement;
    const file = input.files?.item(0);

    if (file) {
      const valid = validateFiles([file], {maxCount: 4, maxSizeMb: 1}, this.messageService)

      if (!valid) return;

      this.picFile = file
    }
  };

  creatingEvent = false;
  picFile?: File;

  private handleUpdatingPic(res: ManageEventResponse) {
    const message: Message = { summary: res.message };

    message.severity = res.data.executed ? "success" : "error";

    this.messageService.add(message);

    this.creatingEvent = false;
  }

  changeEventPos($event: google.maps.LatLngLiteral) {

    this.createEventForm.patchValue({
      latLng: $event
    })
  }
}
