import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../services/api/event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EventItem} from "../../../interfaces/api/event/event";
import {concatWith} from "rxjs";

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [],
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.css'
})
export class EventInfoComponent implements OnInit {
  constructor(private eventService: EventService, private router: Router, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    const eventId = Number(this.activatedRoute.snapshot.queryParams['id']);
    this.eventService.getIfRegisteredToEvent(eventId).subscribe(subscribed => this.isSubscribed = subscribed);
    this.getEvent(eventId);
  }
  private getEvent(eventId: number) {
    this.eventService.getEvent(eventId).subscribe(event => {
      this.event = event;
    });
  }

  @Input() eventId?: number;

  event?: EventItem;
  isSubscribed?: boolean;

  joinEvent = () => {
    this.eventService.registerToEvent(this.event!).subscribe(subscribed => this.isSubscribed = subscribed)
  };

  withdrawFromEvent() {
    this.eventService.withdrawFromEvent(this.event!).subscribe(withdrawed => this.isSubscribed = !withdrawed)
  }
}
