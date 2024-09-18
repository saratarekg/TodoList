import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {TodosComponent} from "./todos/todos.component";
import {AuthComponent} from "./auth/auth.component";
import {AuthService} from "./services/auth/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TodosComponent, AuthComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  date: string = '';
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.displayDate();
    this.authService.autoLogin();
  }
  displayDate(): void {
    {
      let today = new Date();
      let options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      this.date = today.toLocaleDateString('en-US',options);
    }

  }

  Logout() {
    this.authService.logout();
  }
}
