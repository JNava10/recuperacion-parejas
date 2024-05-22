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
export class AvailableEventCardComponent {
  constructor( private router: Router) {}

  @Input() event?: EventItem;

  goToInfo = () => {
    this.router.navigate(['event-info'], {queryParams: {id: this.event?.id}})
  }
}
