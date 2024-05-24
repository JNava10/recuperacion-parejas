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
    const noError = {passwordMatch: 'Las contraseñas no coinciden'};

    if (passwordMatch) {
      // Aunque parezca redundante, es necesario poner nulos los errores para evitar que sigan al volver a lanzar las validaciones.
      passwordFormControl.setErrors(null);
      confPasswordFormControl.setErrors(null);
      return noError
    } else {
      passwordFormControl.setErrors(error);
      confPasswordFormControl.setErrors(error);

      console.log('a')

      return error
    }
  };
}
