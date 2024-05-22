import {Component, OnInit} from '@angular/core';
import {
  AvailableEventListComponent
} from "../../../components/events/available-event-list/available-event-list.component";
import {EventService} from "../../../services/api/event.service";

@Component({
  selector: 'app-find-available-events',
  standalone: true,
  imports: [
    AvailableEventListComponent
  ],
  templateUrl: './find-available-events.component.html',
  styleUrl: './find-find-available-events.component.css'
})
export class FindAvailableEventsComponent implements OnInit {
  constructor(private eventService: EventService) {
    eventService.getAvailableEvents().subscribe(events => {

    })
  }

  ngOnInit(): void {

  }

}
