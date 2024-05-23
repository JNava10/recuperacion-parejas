import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {EventItem} from "../../../interfaces/api/event/event";
import {DatePipe, SlicePipe} from "@angular/common";

@Component({
  selector: 'app-registered-event-card',
  standalone: true,
  imports: [
    DatePipe,
    SlicePipe
  ],
  templateUrl: './registered-event-card.component.html',
  styleUrl: './registered-event-card.component.css'
})
export class RegisteredEventCardComponent {
  constructor( private router: Router) {}

  @Input() event?: EventItem;

  goToInfo = async () => {
    await this.router.navigate(['event-info'], {queryParams: {id: this.event?.id}})
  }
}
