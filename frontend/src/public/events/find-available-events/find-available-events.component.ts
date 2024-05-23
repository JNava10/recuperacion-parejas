import {Component, OnInit} from '@angular/core';
import {
  AvailableEventListComponent
} from "../../../components/events/available-event-list/available-event-list.component";
import {EventService} from "../../../services/api/event.service";
import {EventItem} from "../../../interfaces/api/event/event";

@Component({
  selector: 'app-find-available-events',
  standalone: true,
  imports: [
    AvailableEventListComponent
  ],
  templateUrl: './find-available-events.component.html',
  styleUrl: './find-available-events.component.css'
})
export class FindAvailableEventsComponent implements OnInit {
  constructor(private eventService: EventService) {}

  eventsFetched = false

  ngOnInit(): void {
    this.eventService.getAvailableEvents().subscribe(events => {
      this.events = events
      this.eventsFetched = true;
    });
  }

  events: EventItem[] = [];
}
