import {Component, Input, OnInit} from '@angular/core';
import {EventItem} from "../../../interfaces/api/event/event";
import {DatePipe, SlicePipe} from "@angular/common";
import {EventService} from "../../../services/api/event.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-available-event-card',
  standalone: true,
  imports: [
    DatePipe,
    SlicePipe
  ],
  templateUrl: './available-event-card.component.html',
  styleUrl: './available-event-card.component.css'
})
export class AvailableEventCardComponent implements OnInit {
  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit(): void {

  }

  @Input() event?: EventItem;

  joinEvent = () => {
    this.eventService.subscribeEvent(this.event!)
  };

  goToInfo = () => {
    this.router.navigate()
  }
}
