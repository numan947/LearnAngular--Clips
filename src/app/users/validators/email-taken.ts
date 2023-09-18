import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';

// this is a custom validator apparently doesn't work
// TODO: investigate and fix
@Injectable({
  providedIn: 'root'
})
export class EmailTaken implements AsyncValidator {
  constructor(private auth: AngularFireAuth) { }

  validate = async (control: AbstractControl) : Promise<ValidationErrors | null> => {
    return this.auth.fetchSignInMethodsForEmail(control.value).then(
      response => {
		console.log(response);
		return response.length ? { emailTaken: true } : null
	}
    )
  }
}
