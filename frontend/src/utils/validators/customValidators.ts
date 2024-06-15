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

    console.log(minControl?.value, maxControl?.value)

    if (minControl?.value >= maxControl?.value) {
      error = minExceededError;
      console.log('a')
    } else {
      error = null;
    }

    group.setErrors(error);

    console.log(error)

    return error !== null ? error : null;
  };
}
