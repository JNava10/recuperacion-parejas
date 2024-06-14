import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {SearchResponse} from "../../interfaces/api/user/search";
import {environment} from "../../environments/environment";
import {
  ManageEventResponse,
  EventItem,
  EventResponse, EventSummaryResponse,
  GetEventsResponse,
  SubscribedToEventResponse,
  SubscribeEventResponse, CreateEventItem
} from "../../interfaces/api/event/event";
import {sendTokenParam} from "../../utils/const/url.constants";
import {catchError, map, of, tap} from "rxjs";
import {GetUsersResponse, ManageUserResponse} from "../../interfaces/api/user/user";
import {MessageService} from "primeng/api";
import {getQueryToast} from "../../utils/common.utils";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  createEvent = (event: EventItem) => {
    return this.http.post<EventResponse>(`${environment.apiUrl}/event`, event, {params: {...sendTokenParam}})
  }

  getAllEvents = () => {
    return this.http.get<GetEventsResponse>(`${environment.apiUrl}/event`, {params: {...sendTokenParam}}).pipe(
      tap(body => body.data)
    )
  }

  getAvailableEvents = () => {
    return this.http.get<GetEventsResponse>(`${environment.apiUrl}/event/available`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  getRegisteredEvents = () => {
    return this.http.get<GetEventsResponse>(`${environment.apiUrl}/event/registered`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  editEventDetails = (event: CreateEventItem) => {
    return this.http.put<EventResponse>(
      `${environment.apiUrl}/event/details`,
      event,
      {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as EventResponse;
        return of(error);
      })
    )
  }

  editEventPlace = (event: EventItem) => {
    return this.http.put<EventResponse>(`${environment.apiUrl}/event/place`, event, {params: {...sendTokenParam}})
  }

  deleteEvent = (event: EventItem) => {
    return this.http.delete<EventResponse>(`${environment.apiUrl}/event/${event.id}`, {params: {...sendTokenParam}})
  }

  getEvent = (id: number) => {
    return this.http.get<EventResponse>(`${environment.apiUrl}/event/${id}`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  getIfRegisteredToEvent = (id: number) => {
    return this.http.get<SubscribedToEventResponse>(`${environment.apiUrl}/event/subscribed/${id}`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  registerToEvent(event: EventItem) {
    return this.http.post<SubscribeEventResponse>(
      `${environment.apiUrl}/event/subscribe/${event.id}`,
      {},
      {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as SubscribeEventResponse;
        return of(error);
      })
    )
  }

  withdrawFromEvent(event: EventItem) {
    return this.http.post<SubscribeEventResponse>(
      `${environment.apiUrl}/event/withdraw/${event.id}`,
      {},
      {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as SubscribeEventResponse;

        return of(error);
      })
    )
  }

  getSummaryFile(event: EventItem) {
    return this.http.get<EventSummaryResponse>(`${environment.apiUrl}/event/summary/${event.id}`, {params: {...sendTokenParam}})
  }

  updateEventPic = (id: number, file: File) => {
    const fileKey = 'pic';

    const formData = new FormData();
    formData.append(fileKey, file)

    return this.http.put<ManageEventResponse>(`${environment.apiUrl}/event/pic/${id}`, formData, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as ManageEventResponse;

        return of(error);
      })
    );
  }

  getEventMembers = (id: number) => {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/event/members/${id}`, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetUsersResponse;
        return of(error);
      })
    );
  }
}
