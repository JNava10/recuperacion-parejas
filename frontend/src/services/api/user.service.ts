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
  UserItem, GetCountResponse, CrudEditResponse, GetSelfRoles, GetSelfRoleNames, UpdateUserAvatar
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

    return this.http.post<SearchResponse>(`${environment.apiUrl}/user/member/search`, body).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as SearchResponse;

        return of(error);
      })
    );
  }

  findUserById = (id: number) => {
    return this.http.get<GetUserResponse>(`${environment.apiUrl}/user/${id}`, {params: {...sendTokenParam, withRoles: true}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetUserResponse;

        return of(error);
      })
    )
  }

  getAllUsers = () => {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/user`, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetUsersResponse;

        return of(error);
      })
    )
  }

  getNotDeletedWithRoles = () => {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/user/with-roles`, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetUsersResponse;

        return of(error);
      })
    )
  }

  createUser = (user: CreateUserItem) => {
    return this.http.post<CreateUserResponse>(`${environment.apiUrl}/user`, user,{params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as CreateUserResponse;

        return of(error);
      })
    )
  }

  registerUser = (user: CreateUserItem) => {
    return this.http.post<CreateUserResponse>(`${environment.apiUrl}/user/register`, user).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as CreateUserResponse;

        return of(error);
      })
    )
  }

  sendRecoverEmail = (email: string) => {
    return this.http.post<SendRecoverEmailResponse>(`${environment.apiUrl}/user/send-recover-email`, {email}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as SendRecoverEmailResponse;

        return of(error);
      })
    )
  }

  sendRecoverCode = (code: string, email: string) => {
    return this.http.post<SendRecoverCodeResponse>(`${environment.apiUrl}/user/send-recover-code`, {code, email}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as SendRecoverCodeResponse;

        return of(error);
      })
    )
  }

  updatePassword = (id: number, password: string) => {
    return this.http.put<ManageUserResponse>(`${environment.apiUrl}/user/password/${id}`, {password},{params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as ManageUserResponse;

        return of(error);
      })
    )
  }

  addRoles = (id: number, roles: number[]) => {
    return this.http.post<ManageUserResponse>(`${environment.apiUrl}/user/roles/${id}`, {roles},{params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as ManageUserResponse;

        return of(error);
      })
    )
  }

  deleteRoles = (id: number, roles: number[]) => {
    return this.http.post<CrudEditResponse>(`${environment.apiUrl}/user/roles/delete/${id}`, {roles}, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as CrudEditResponse;

        return of(error);
      })
    )
  }

  editUserData = (data: CreateUserItem, id: number) => {
    return this.http.put<CrudEditResponse>(`${environment.apiUrl}/user/data/${id}`, data,{params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as CrudEditResponse;

        return of(error);
      })
    )
  }

  sendNewPassword = (password: string, recoverToken: string) => {
    return this.http.put<RecoverPasswordResponse>(`${environment.apiUrl}/user/recover-account/password`, {password},{params: {...sendTokenParam}, headers: {recoverToken}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as RecoverPasswordResponse;

        return of(error);
      })
    )
  }

  enableOrDisableUser = (user: UserItem, enable: boolean) => {
    return this.http.put<CrudEditResponse>(`${environment.apiUrl}/user/enable-or-disable/${user.id}`, {enabled: enable},{params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as CrudEditResponse;

        return of(error);
      })
    )
  }

  deleteUser = (user: UserItem) => {
    return this.http.delete<DeleteUserResponse>(`${environment.apiUrl}/user/${user.id}`, {params: {...sendTokenParam}} ).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as DeleteUserResponse;

        return of(error);
      })
    )
  }


  editProfileData = (user: UserItem) => {
    return this.http.put<ManageUserResponse>(`${environment.apiUrl}/user/profile/data/`, user, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as ManageUserResponse;

        return of(error);
      })
    )
  }

  getOwnData = () => {
    return this.http.get<GetProfileResponse>(`${environment.apiUrl}/user/profile`, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetProfileResponse;

        return of(error);
      })
    )
  }

  getChats = () => {
    return this.http.get<GetPendingChatsResponse>(`${environment.apiUrl}/user/pending-chats`, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetPendingChatsResponse;

        return of(error);
      })
    )
  }

  getRoleUsers = (role: string) => {
    return this.http.get<GetUsersResponse>(`${environment.apiUrl}/user/role/${role}`, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetUsersResponse;

        return of(error);
      })
    )
  }

  getSelfRoles = () => {
    return this.http.get<GetSelfRoles>(`${environment.apiUrl}/user/roles`, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetSelfRoles;

        return of(error);
      })
    )
  }

  getSelfRoleNames = () => {
    return this.http.get<GetSelfRoleNames>(`${environment.apiUrl}/user/roles/name`, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetSelfRoleNames;

        return of(error);
      })
    )
  }

  updateUserAvatar = (id: number, file: File) => {
    const fileKey = 'avatar';

    const formData = new FormData();
    formData.append(fileKey, file)

    console.log(id)

    return this.http.put<UpdateUserAvatar>(`${environment.apiUrl}/user/avatar/${id}`, formData, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as UpdateUserAvatar;

        return of(error);
      })
    );
  }

  getRoleUsersCount = (roleName: string) => {
    return this.http.get<GetCountResponse>(`${environment.apiUrl}/user/role-users/${roleName}`, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetCountResponse;

        return of(error);
      })
    )
  }

  // TODO: Mover a NotificationApiService
  getNotifications = () => {
    return this.http.get<GetNotificationsResponse>(`${environment.apiUrl}/user/notifications`, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as GetNotificationsResponse;

        return of(error);
      })
    )
  }

  readAllNotifications = () => {
    return this.http.put<CrudEditResponse>(`${environment.apiUrl}/user/notifications/read`, {}, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as CrudEditResponse;

        return of(error);
      })
    )
  }

  updateOwnPreferences = (preferences: PreferenceValueFormItem[]) => {
    return this.http.put<CrudEditResponse>(`${environment.apiUrl}/user/preferences/`,{preferences}, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as CrudEditResponse;

        return of(error);
      })
    );
  }

  logout = () => {
    return this.http.post<CrudEditResponse>(`${environment.apiUrl}/user/logout/`,{}, {params: {...sendTokenParam}}).pipe(
      catchError((res: HttpErrorResponse) => {
        const error = res.error as CrudEditResponse;

        return of(error);
      })
    );
  }
}
