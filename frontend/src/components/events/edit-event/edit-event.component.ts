import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import * as regex from "../../../utils/const/regex.constants";
import MapMouseEvent = google.maps.MapMouseEvent;
import {DatePipe, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {} from "googlemaps";
import {EventItem} from "../../../interfaces/api/event/event";
import {EventService} from "../../../services/api/event.service";

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    NgIf,
    PaginatorModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit {
  @Input() event?: EventItem;
  @Output() edited = new EventEmitter<boolean>();

  constructor(private eventService: EventService) {}

  latLng = {
    "lat": 38.69293623181963,
    "lng": -4.108717751788397
  };

  private mapMarker?: google.maps.Marker;
  @ViewChild('map') mapElement: any;
  map?: google.maps.Map;
  center: google.maps.LatLngLiteral = this.latLng;

  ngOnInit(): void {
    this.initMap();
    this.patchValues(this.event!);
  }

  // Esto es necesario para poder mostrar el mapa.
  editEventForm = new FormGroup({
    name: new FormControl(this.event?.name, {validators: [
        Validators.required, Validators.pattern(regex.event.name),
      ], updateOn: "submit"}),

    description: new FormControl('', [
      Validators.required, Validators.pattern(regex.event.description)
    ]),

    scheduledDate: new FormControl('', [
      Validators.required, Validators.pattern(regex.event.scheduledTime)
    ]),

    scheduledTime: new FormControl('', [
      Validators.required, Validators.pattern(regex.event.scheduledDate)
    ]),

    latLng: new FormControl({lat: 0, lng: 0}, [Validators.required])
  }, {updateOn: "submit"});

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: this.center,
      zoom: 8
    });

    // Al hacer click, bindeamos la latitud y longitud del evento al del formulario.
    this.map.addListener("click", (mapsMouseEvent: MapMouseEvent) => {
      if (this.mapMarker) this.mapMarker.setMap(null); // En caso de que esté el marcador, lo borramos.

      const latLng = mapsMouseEvent.latLng.toJSON();

      this.editEventForm.value.latLng = latLng;

      this.mapMarker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        title: `Lugar del evento`,
      });
    });
  }

  handleEditForm() {
    if (!this.editEventForm.valid) return;

    const formData = this.editEventForm.value;
    const scheduledDateTime = `${formData.scheduledDate} ${formData.scheduledTime}`;

    const event: EventItem = {
      name: formData.name!,
      description: formData.description!,
      scheduledDateTime: scheduledDateTime,
      picUrl: "https://cdn-9.motorsport.com/images/amp/YpNpMWJ0/s1000/ferrari-f1-75-con-paraspruzzi.jpg",
      summaryUrl: "https://www.fia.com/sites/default/files/fia_2024_formula_1_technical_regulations_-_issue_1_-_2023-04-25.pdf" ,
      latitude: 10.1,
      longitude: 10.2
    }

    this.eventService.editEvent(event).subscribe(body => {
      this.edited.emit(body.data.executed)
    })
  }

  private patchValues = (event: EventItem) => {
    const scheduledDateTime = new Date(event.scheduledDateTime!);
    const scheduledDate = new DatePipe('en-US').transform(scheduledDateTime, 'YYYY-MM-dd')?.toString();
    const scheduledTime = new DatePipe('en-US').transform(scheduledDateTime, 'hh:ss')?.toString();

    console.log(scheduledDate)

    this.editEventForm.patchValue({
      name: event.name,
      description: event.description,
      scheduledTime: scheduledTime,
      scheduledDate: scheduledDate,
    });
  }
}
