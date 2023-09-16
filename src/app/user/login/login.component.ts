import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email:'',
    password:''
  };
  alertColor: string = 'blue';
  showAlert: boolean = false;
  alertMsg:string = 'Please wait while we log you in!';
  inSubmission:boolean = false;

  constructor(public auth:AuthService){}

  async login() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait while we log you in!';
    this.alertColor = 'blue';

    try {
      await this.auth.loginUser(this.credentials.email, this.credentials.password);
    } catch (error) {
      this.inSubmission = false;
      this.alertMsg = 'An unexpected error occurred! Try again!';
      this.alertColor = 'red';
      console.log(error);
      return;
    }

    this.alertMsg = 'Successful! You are now logged in.';
    this.alertColor = 'green';
    
  }
  
}
