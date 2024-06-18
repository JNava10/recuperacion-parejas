import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function passwordsMatch(passwordControlName: string, confirmPasswordName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const passwordsGroup = group.get('passwords')!;

    const passwordFormControl = passwordsGroup.get(passwordControlName);
    const confPasswordFormControl = passwordsGroup.get(confirmPasswordName);

    if (!passwordFormControl || !confPasswordFormControl) {
      return {passwordMatch: 'Los nombres indicados no son correctos.'}
    }

    const passwordMatch = passwordFormControl.value === confPasswordFormControl.value;
    const error = {passwordMatch: 'Las contraseñas no coinciden'};
    const noError = null;

    if (passwordMatch) {
      // Aunque parezca redundante, es necesario poner nulos los errores para evitar que sigan al volver a lanzar las validaciones.
      passwordFormControl.setErrors(null);
      confPasswordFormControl.setErrors(null);
      return noError
    } else {
      passwordFormControl.setErrors(error);
      confPasswordFormControl.setErrors(error);

      return error
    }
  };
}

export function rangeValidation(minControlName: string, maxControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const minControl = group.get(minControlName);
    const maxControl = group.get(maxControlName);
    const minExceededError = {minExceeded: 'El minimo no puede ser mayor que el maximo.'};

    let error: any;

    if (minControl?.value >= maxControl?.value) {
      error = minExceededError;
    } else {
      error = null;
    }

    group.setErrors(error);

    return error !== null ? error : null;
  };
}

export function closeDateIsValid(scheduleControlName: string, closeControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const scheduleControl = group.get(scheduleControlName);
    const closeControl = group.get(closeControlName);
    const dateExceededError = {invalidCloseTime: 'La fecha de cerrado no puede ser mayor que la fecha planeada.'};

    let error: any;

    const scheduleDate = new Date(scheduleControl?.value)
    const maxCloseDate = new Date(scheduleDate.getDate() - 1)
    const closeDate = new Date(closeControl?.value)

    console.log(scheduleDate, closeDate)

    if (scheduleControl?.value < closeControl?.value) {
      error = dateExceededError;
    } else if (closeDate <= maxCloseDate) {
      error = dateExceededError;
    } else {
      error = null;
    }

    group.setErrors(error);

    return error !== null ? error : null;
  };
}

export function dateIsNotPast(scheduleControlName: string, closeControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {

    const scheduleControl = group.get(scheduleControlName);
    const closeControl = group.get(closeControlName);
    const closePastError = {closePast: 'La fecha de cerrado no puede ser anterior a la actual.'};
    const schedulePastError = {schedulePast: 'La fecha del evento no puede ser anterior a la actual.'};

    let error = null;

    const scheduleDate = new Date(scheduleControl?.value)
    const closeDate = new Date(closeControl?.value)

    console.log(scheduleDate, closeDate)

    if (scheduleDate < new Date(Date.now())) {
      error = schedulePastError;
      group.setErrors(error);
    }

    if (closeDate < new Date(Date.now())) {
      error = closePastError;
      group.setErrors(error);
    }

    return error !== null ? error : null;
  }
}
