import { Component } from '@angular/core';
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



  register(){
    this.showAlert = true;
    this.alertMsg = 'Please wait while we create your account!';
    this.alertColor = 'blue';
  }
}
