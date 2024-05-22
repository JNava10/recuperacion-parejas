import {Component, Input} from '@angular/core';
import {EventItem} from "../../../interfaces/api/event/event";
import {DatePipe, SlicePipe} from "@angular/common";

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
  @Input() event?: EventItem;
}
