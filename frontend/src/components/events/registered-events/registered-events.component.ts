import {Component, Input, OnInit} from '@angular/core';
import {EventItem} from "../../../interfaces/api/event/event";
import {AvailableEventCardComponent} from "../available-event-card/available-event-card.component";
import {RegisteredEventCardComponent} from "../registered-event-card/registered-event-card.component";
import {EventService} from "../../../services/api/event.service";

@Component({
  selector: 'app-registered-events',
  standalone: true,
  imports: [
    AvailableEventCardComponent,
    RegisteredEventCardComponent
  ],
  templateUrl: './registered-events.component.html',
  styleUrl: './registered-events.component.css'
})
export class RegisteredEventsComponent implements OnInit {
  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getRegisteredEvents().subscribe((events) => {
      this.events = events;
      this.eventsFetched = true;
    });
  }

  events?: EventItem[];

  protected eventsFetched = false;
}
