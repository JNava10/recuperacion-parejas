import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../services/api/event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EventItem} from "../../../interfaces/api/event/event";
import {concatWith} from "rxjs";
import {CustomToastComponent} from "../../custom-toast/custom-toast.component";
import {Message, MessageService} from "primeng/api";
import {getQueryToast, showQueryToast} from "../../../utils/common.utils";

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [
    CustomToastComponent
  ],
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.css'
})
export class EventInfoComponent implements OnInit {
  constructor(private eventService: EventService, private messageService: MessageService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const eventId = Number(this.activatedRoute.snapshot.queryParams['id']);
    this.eventService.getIfRegisteredToEvent(eventId).subscribe(subscribed => this.isSubscribed = subscribed);
    this.getEvent(eventId);
  }

  private getEvent(eventId: number) {
    this.eventService.getEvent(eventId).subscribe(event => {
      this.event = event;
      console.log(this.event)

    });
  }

  @Input() eventId?: number;

  event?: EventItem;
  isSubscribed?: boolean;

  joinEvent = () => {
    this.eventService.registerSelfToEvent(this.event!).subscribe(body => {
      if (body.data.errors) {
        body.data.errors.forEach(error => showQueryToast(body.data.executed, error, this.messageService))
      } else {
        showQueryToast(body.data.executed, body.message, this.messageService)
      }

      if (!body.data.closed) {
        this.isSubscribed = body.data.executed;
      }
    })
  };

  withdrawFromEvent() {
    this.eventService.withdrawSelfFromEvent(this.event!).subscribe(body => {
      if (body.data.errors) {
        body.data.errors.forEach(error => showQueryToast(body.data.executed, error, this.messageService))
      } else {
        showQueryToast(body.data.executed, body.message, this.messageService)
      }

      return this.isSubscribed = !body.data.executed;
    })
  }

  protected readonly Date = Date;
}
