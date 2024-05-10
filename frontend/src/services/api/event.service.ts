import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SearchResponse} from "../../interfaces/api/user/search";
import {environment} from "../../environments/environment";
import {CreateEventValues} from "../../interfaces/forms/events/events";
import {CreateEventQuery, CreateEventResponse} from "../../interfaces/api/event/event";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  createEvent = (event: CreateEventValues) => {
    return this.http.post<CreateEventResponse>(`${environment.apiUrl}/event`, event)
  }
}
