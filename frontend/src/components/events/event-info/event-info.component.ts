import {Component, Input, OnInit} from '@angular/core';
import {EventService} from "../../../services/api/event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EventItem} from "../../../interfaces/api/event/event";

@Component({
  selector: 'app-event-info',
  standalone: true,
  imports: [],
  templateUrl: './event-info.component.html',
  styleUrl: './event-info.component.css'
})
export class EventInfoComponent implements OnInit {
  constructor(private eventService: EventService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>
      this.eventId = Number(params.get('id')!)
    )

    this.eventService.getEvent(this.eventId!)
  }

  event?: EventItem;
  @Input() eventId?: number;
}
