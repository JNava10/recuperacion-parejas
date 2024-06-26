import { provideAnimations } from "@angular/platform-browser/animations";
import { TuiRootModule } from "@taiga-ui/core";
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "../interceptors/auth.interceptor";
import {MessageService} from "primeng/api";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [MessageService, provideAnimations(), provideRouter(routes), importProvidersFrom(TuiRootModule), provideHttpClient(withInterceptors([authInterceptor])), provideAnimationsAsync()]
};
