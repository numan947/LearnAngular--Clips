import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private auth:AuthService){}

  registerForm = new FormGroup({
    name: new FormControl('',[
      Validators.required,
      Validators.minLength(3),
    ]),
    
    email: new FormControl('', [
      Validators.email,
      Validators.required
    ]),
    
    age: new FormControl<number|null>(null,[
      Validators.required,
      Validators.min(18),
      Validators.max(150),
    ]),
    
    password: new FormControl('',
    [
    Validators.required,
    Validators.pattern(".*")
    ]),
    
    confirmPassword: new FormControl('',
    [Validators.required]),
    
    phoneNumber: new FormControl('',
    [Validators.required,
    Validators.minLength(13),
  Validators.maxLength(13)]),
  });
  
  alertColor: string = 'blue';
  showAlert: boolean = false;
  alertMsg:string = 'Please wait while we create your account!';
  inSubmission:boolean = false;



  async register(){
    this.showAlert = true;
    this.alertMsg = 'Please wait while we create your account!';
    this.alertColor = 'blue';
    this.inSubmission = true;

    
    try{
      this.auth.createUser(this.registerForm.value as IUser)
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
