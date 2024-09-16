import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TodosComponent} from "./todos/todos.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TodosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  date: string = '';

  ngOnInit(): void {
    this.displayDate();
  }
  displayDate(): void {
    {
      let today = new Date();
      let options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      this.date = today.toLocaleDateString('en-US',options);
    }

  }

}
