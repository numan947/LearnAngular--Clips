import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from 'src/app/users/validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/;
  registerForm = new FormGroup({
    name: new FormControl('',[
      Validators.required,
      Validators.minLength(3),
    ]),
    
    email: new FormControl('', [
      Validators.email,
      Validators.required
    ], [this.emailTaken.validate]),
    
    age: new FormControl<number|null>(null,[
      Validators.required,
      Validators.min(18),
      Validators.max(150),
    ]),
    
    password: new FormControl('',
    [
    Validators.required,
    Validators.pattern(this.passwordRegex),
    ]),
    
    confirmPassword: new FormControl('',
    [
      Validators.required,
      Validators.pattern(this.passwordRegex)
    ]),

    phoneNumber: new FormControl('',
    [Validators.required,
    Validators.minLength(13),
  Validators.maxLength(13)]),
  },[RegisterValidators.match('password','confirmPassword')]);
  
  alertColor: string = 'blue';
  showAlert: boolean = false;
  alertMsg:string = 'Please wait while we create your account!';
  inSubmission:boolean = false;


  constructor(private auth:AuthService, private emailTaken:EmailTaken){}

  async register(){
    this.showAlert = true;
    this.alertMsg = 'Please wait while we create your account!';
    this.alertColor = 'blue';
    this.inSubmission = true;

    
    try{
      await this.auth.createUser(this.registerForm.value as IUser);
    }catch(e){
      console.log(e);
      this.alertMsg = "An unexpected error occured. Please try again later.";
      this.alertColor = 'red';
      this.inSubmission = false;
      return;
    }


    this.alertMsg = "Success! Your account has been created!";
    this.alertColor = "green";
  }
}
