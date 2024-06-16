import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {SearchResponse} from "../../interfaces/api/user/search";
import {
  CreateUserItem,
  DeleteUserResponse,
  GetPendingChatsResponse,
  GetProfileResponse,
  GetUserResponse,
  GetUsersResponse,
  ManageUserResponse,
  CreateUserResponse,
  UserItem, GetCountResponse, CrudEditResponse, GetSelfRoles
} from "../../interfaces/api/user/user";
import {sendTokenParam} from "../../utils/const/url.constants";
import {catchError, map, of} from "rxjs";
import {
  RecoverPasswordResponse,
  SendRecoverCodeResponse,
  SendRecoverEmailResponse
} from "../../interfaces/recover-password";
import {MessageService} from "primeng/api";
import {GetNotificationsResponse} from "../../interfaces/api/others/notification";
import {PreferenceValueFormItem} from "../../interfaces/api/preference/preferenceItem";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  searchMember = (input: string) => {
    const body = {input}

    return this.http.post<SearchResponse>(`${environment.apiUrl}/user/member/search`, body);
  }

  findUserById = (id: number) => {
    return this.http.get<GetUserResponse>(`${environment.apiUrl}/user/${id}`, {params: {...sendTokenParam, withRoles: true}}).pipe(
      map(body => body.data.query)
    )
  }

  getAllUsers = () => {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/user`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  getNotDeletedWithRoles = () => {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/user/with-roles`, {params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  createUser = (user: CreateUserItem) => {
    return this.http.post<CreateUserResponse>(`${environment.apiUrl}/user`, user,{params: {...sendTokenParam}})
  }

  registerUser = (user: CreateUserItem) => {
    return this.http.post<CreateUserResponse>(`${environment.apiUrl}/user/register`, user)
  }

  sendRecoverEmail = (email: string) => {
    return this.http.post<SendRecoverEmailResponse>(`${environment.apiUrl}/user/send-recover-email`, {email}).pipe(
      map(body => body.data.executed)
    )
  }

  sendRecoverCode = (code: string, email: string) => {
    return this.http.post<SendRecoverCodeResponse>(`${environment.apiUrl}/user/send-recover-code`, {code, email}).pipe(
      map(body => body.data)
    )
  }

  updatePassword = (id: number, password: string) => {
    return this.http.put<ManageUserResponse>(`${environment.apiUrl}/user/password/${id}`, {password},{params: {...sendTokenParam}}).pipe(
      map(body => body.data.query)
    )
  }

  addRoles = (id: number, roles: number[]) => {
    return this.http.post<ManageUserResponse>(`${environment.apiUrl}/user/roles/${id}`, {roles},{params: {...sendTokenParam}})
  }

  deleteRoles = (id: number, roles: number[]) => {
    return this.http.post<CrudEditResponse>(`${environment.apiUrl}/user/roles/delete/${id}`, {roles}, {params: {...sendTokenParam}})
  }

  editUserData = (data: CreateUserItem, id: number) => {
    return this.http.put<CrudEditResponse>(`${environment.apiUrl}/user/data/${id}`, data,{params: {...sendTokenParam}})
  }

  sendNewPassword = (password: string, recoverToken: string) => {
    return this.http.put<RecoverPasswordResponse>(`${environment.apiUrl}/user/recover-account/password`, {password},{params: {...sendTokenParam}, headers: {recoverToken}}).pipe(
      map(body => body.data.executed)
    )
  }

  enableOrDisableUser = (user: UserItem, enabled: boolean) => {
    return this.http.put<RecoverPasswordResponse>(`${environment.apiUrl}/user/enable-or-disable/${user.id}`, {enabled},{params: {...sendTokenParam}}).pipe(
      map(body => body.data.executed)
    )
  }

  deleteUser = (user: UserItem) => {
    return this.http.delete<DeleteUserResponse>(`${environment.apiUrl}/user/${user.id}`, {params: {...sendTokenParam}} )
  }


  editProfileData = (user: UserItem) => {
    return this.http.put<ManageUserResponse>(`${environment.apiUrl}/user/profile/data/${user.id}`, user, {params: {...sendTokenParam}});
  }

  getOwnData = () => {
    return this.http.get<GetProfileResponse>(`${environment.apiUrl}/user/profile`, {params: {...sendTokenParam}});
  }

  getChats = () => {
    return this.http.get<GetPendingChatsResponse>(`${environment.apiUrl}/user/pending-chats`, {params: {...sendTokenParam}});
  }

  getRoleUsers = (role: string) => {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/user/role/${role}`, {params: {...sendTokenParam}});
  }

  getSelfRoles = () => {
    return this.http.get<GetSelfRoles>(`${environment.apiUrl}/user/roles`, {params: {...sendTokenParam}});
  }

  updateUserAvatar = (id: number, file: File) => {
    const fileKey = 'avatar';

    const formData = new FormData();
    formData.append(fileKey, file)

    console.log(id)

    return this.http.put<ManageUserResponse>(`${environment.apiUrl}/user/avatar/${id}`, formData, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as ManageUserResponse;

        return of(error);
      })
    );
  }

  getRoleUsersCount = (roleName: string) => {
    return this.http.get<GetCountResponse>(`${environment.apiUrl}/user/role-users/${roleName}`, {params: {...sendTokenParam}});
  }

  getNotifications = () => {
    return this.http.get<GetNotificationsResponse>(`${environment.apiUrl}/user/notifications`, {params: {...sendTokenParam}});
  }


  // TODO: Mover a PreferenceService
  updateOwnPreferences = (preferences: PreferenceValueFormItem[]) => {
    return this.http.put<CrudEditResponse>(`${environment.apiUrl}/user/preferences/`,{preferences}, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as CrudEditResponse;

        return of(error);
      })
    );
  }
}
