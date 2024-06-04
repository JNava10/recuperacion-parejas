import {Component, OnInit} from '@angular/core';
import {CreateEventComponent} from "../../components/events/create-event/create-event.component";
import {FormsModule} from "@angular/forms";
import {EventService} from "../../services/api/event.service";
import {EventItem} from "../../interfaces/api/event/event";
import {EventCardComponent} from "../../app/components/events/event-card/event-card.component";
import {DialogModule} from "primeng/dialog";


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CreateEventComponent,
    FormsModule,
    EventCardComponent,
    DialogModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  constructor(private eventService: EventService) {}

  eventsFetched = false;

  ngOnInit() {
    this.getAllEvents()
  }

  events: EventItem[] = [];

  getAllEvents = () => {
    if (this.events.length > 0) this.events = [];

    this.eventService.getAllEvents().subscribe(body => {
      this.events = body.data.query;
      this.eventsFetched = true;
    });
  }

  creatingEvent = false;
}

