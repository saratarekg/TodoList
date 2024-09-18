import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import {AuthService} from "../services/auth/auth.service";
import {Router} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    FormsModule,
    MatProgressSpinner,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  constructor(private authService: AuthService, private router: Router) {
  }

  authForm= new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })

  isLoginMode: boolean = true;
  error='';

  onSwitchMode() {
    this.isLoginMode=!this.isLoginMode;
  }

  onSubmit() {
  console.log(this.authForm.value)
    if(!this.authForm.valid){
      return;
    }
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;
    if(email && password){
      if(this.isLoginMode){
        this.authService.login(email,password).subscribe(
          resData =>{
            console.log(resData);
            this.router.navigate(['/todos']);
          },
          error => {
            console.log("errorssss",error);
            this.error="An error occured!";
          }
        );
      }
      else
      {
        this.authService.signup(email,password).subscribe(
          resData =>{ console.log(resData); },
          error => {console.log(error); }
        );
      }

    }
    // this.authForm.reset();
  }


}
