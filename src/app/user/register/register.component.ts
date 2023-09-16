import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    name: new FormControl('',[
      Validators.required,
      Validators.minLength(3),
    ]),
    
    email: new FormControl('', [
      Validators.email,
      Validators.required
    ]),
    
    age: new FormControl('',[
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

  constructor(private auth:AngularFireAuth){}


  async register(){
    this.showAlert = true;
    this.alertMsg = 'Please wait while we create your account!';
    this.alertColor = 'blue';
    
    this.inSubmission = true;
    
    try{
    const {email, password} = this.registerForm.value;
    const userCred = await this.auth.createUserWithEmailAndPassword(
      email as string, password as string
      );

      console.log(userCred);
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
