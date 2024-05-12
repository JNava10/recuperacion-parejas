import {Component, Input} from '@angular/core';
import {EventItem} from "../../../../interfaces/api/event/event";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {
  @Input() event?: EventItem
}
