import { Injectable } from '@angular/core';
import {AbstractControl, ValidatorFn} from "@angular/forms";
import * as regex from "../utils/const/regex.constants";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  isEmail(control: AbstractControl) {
    const valid = regex.EMAIL_REGEX.test(control.value);
    return valid ? { isEmail: { value: control.value } } : null;
  }

  isPassword(control: AbstractControl) {
    const valid = regex.PASSWORD_REGEX.test(control.value);
    console.log(valid)
    return valid ? { isStrengthPassword: { value: control.value } } : null;
  }
}
