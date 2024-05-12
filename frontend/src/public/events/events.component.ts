import {Component, OnInit} from '@angular/core';
import {CreateEventComponent} from "../../components/events/create-event/create-event.component";
import {FormsModule} from "@angular/forms";
import {EventService} from "../../services/api/event.service";
import {Event} from "../../interfaces/api/event/event";


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CreateEventComponent,
    FormsModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.getAllEvents().subscribe(body => this.events = body.data.query)
  }

  events: Event[] = [];
}

