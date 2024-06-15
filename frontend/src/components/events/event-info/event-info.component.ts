import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../services/api/event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EventItem} from "../../../interfaces/api/event/event";
import {concatWith} from "rxjs";
import {CustomToastComponent} from "../../custom-toast/custom-toast.component";
import {Message, MessageService} from "primeng/api";
import {getQueryToast} from "../../../utils/common.utils";

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
      const message: Message = getQueryToast(body.data.executed, body.message);

      if (body.data.executed) {
        message.severity = body.data.closed ? 'warn' : 'success'
        message.summary = body.data.closed ? '¡Ojo!' : 'Exito'
      }

      this.messageService.add(message)

      if (!body.data.closed) {
        this.isSubscribed = body.data.executed;
      }
    })
  };

  withdrawFromEvent() {
    this.eventService.withdrawSelfFromEvent(this.event!).subscribe(body => {
      const message = getQueryToast(body.data.executed, body.message)

      if (body.data.executed) message.severity = 'info';

      this.messageService.add(message)

      return this.isSubscribed = !body.data.executed;
    })
  }

  protected readonly Date = Date;
}
