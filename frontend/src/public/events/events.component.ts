import {Component, OnInit} from '@angular/core';
import {CreateEventComponent} from "../../components/events/create-event/create-event.component";
import {FormsModule} from "@angular/forms";
import {EventService} from "../../services/api/event.service";
import {EventItem} from "../../interfaces/api/event/event";
import {EventCardComponent} from "../../app/components/events/event-card/event-card.component";


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CreateEventComponent,
    FormsModule,
    EventCardComponent
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  constructor(private eventService: EventService) {}

  eventsFetched = false;

  ngOnInit() {
    this.eventService.getAllEvents().subscribe(body => {
      this.events = body.data.query;
      this.eventsFetched = true;
    })
  }

  events: EventItem[] = [];
}

