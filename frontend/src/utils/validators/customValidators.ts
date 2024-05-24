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
    return passwordMatch ? {passwordMatch: {value: group.value}} : null;
  };
}
