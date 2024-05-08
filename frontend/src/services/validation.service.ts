import { Injectable } from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import * as regex from "../utils/const/regex.constants";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  isEmail = () => {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = regex.EMAIL_REGEX.test(control.value);
      return valid ? { isEmail: { value: control.value } } : null;
    };
  }

  isPassword = () => {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = regex.EMAIL_REGEX.test(control.value);
      return valid ? { password: { value: control.value } } : null;
    };
  }
}
