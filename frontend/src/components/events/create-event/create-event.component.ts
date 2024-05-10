import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {CalendarModule} from "primeng/calendar";
import {CreateEventValues} from "../../../interfaces/forms/events/events";
import {EventService} from "../../../services/api/event.service";
import {} from 'googlemaps';

let latLng = {
  "lat": 38.69293623181963,
  "lng": -4.108717751788397
};

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CalendarModule
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent implements OnInit {
  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.initMap()
  }

  // Esto es necesario para poder mostrar el mapa.
  @ViewChild('map') mapElement: any;
  map?: google.maps.Map;
  center: google.maps.LatLngLiteral = latLng;

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: this.center,
      zoom: 8
    });

    this.map.addListener("click", (mapsMouseEvent) => {
      const latLng = mapsMouseEvent.latLng.toJSON();

      console.log(latLng)
    });
  }

  @Output() created = new EventEmitter<boolean>();

  createEventForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    scheduledDate: new FormControl(''),
    latLng: new FormControl({lat: 0, lng: 0})
  });

  handleCreateForm = () => {
    const formData = this.createEventForm.value;
    const event: CreateEventValues = {
      name: formData.name!,
      description: formData.description!,
      scheduledDate: formData.scheduledDate!,
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
