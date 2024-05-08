import { HttpInterceptorFn } from '@angular/common/http';
import {StorageService} from "../services/storage.service";
import {environment} from "../environments/environment";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.params.get('auth')) {
    const storageService = new StorageService();
    const token =  storageService.get('token')!;
    const clonedRequest = req.clone({
      headers: req.headers.set(environment.tokenHeader, token)
    })

    return next(clonedRequest);
  }

  return next(req);
};
