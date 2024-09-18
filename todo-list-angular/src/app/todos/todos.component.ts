import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {TodoService} from "../services/todo/todo.service";
import {CommonModule, NgForOf} from "@angular/common";

@Component({
  selector: 'app-todos',
  standalone: true,
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
  imports: [FormsModule, CommonModule]
})
export class TodosComponent implements OnInit {
  tasks: any[] = [];
  newTask: string = '';
  searchPending: string = '';
  searchCompleted: string = '';
  private tasksSubscription: Subscription = new Subscription();

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasksSubscription.add(
      this.todoService.getTasks().subscribe(
        tasks => {
          this.tasks = tasks.map(task => ({ ...task, isEditing: false }));
        },
        error => {
          console.error('Error fetching tasks: ', error);
        }
      )
    );
  }

  addTask(): void {
    if (!this.newTask.trim()) return;
    this.todoService.addTask(this.newTask).subscribe(
      () => {
        this.newTask = '';
        this.loadTasks(); // Reload tasks to reflect changes
      },
      error => {
        console.error('Error adding task: ', error);
      }
    );
  }

  editTask(task: any): void {
    // Set edit mode and initialize editText
    task.isEditing = true;
    task.editText = task.text;
  }

  updateTask(id: string, updatedText: string): void {
    this.todoService.updateTask(id, { text: updatedText }).subscribe(
      () => {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
          task.text = updatedText;
          task.isEditing = false; // Exit edit mode

        }
      },
      error => {
        console.error('Error updating task: ', error);
      }
    );
  }

  deleteTask(id: string): void {
    this.todoService.deleteTask(id).subscribe(
      () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
      },
      error => {
        console.error('Error deleting task: ', error);
      }
    );
  }

  toggleCompletion(id: string, completed: boolean): void {
    this.todoService.toggleCompletion(id, completed).subscribe(
      () => {
        const task = this.tasks.find(t => t.id === id);
        if (task) task.completed = completed;
      },
      error => {
        console.error('Error toggling task completion: ', error);
      }
    );
  }

  handleCheckboxChange(taskId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;
    this.toggleCompletion(taskId, isChecked);
  }

  handleInputChange(taskId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const updatedText = input.value;
    this.updateTask(taskId, updatedText);
  }

  filterTasks(status: 'incomplete' | 'completed', searchTerm: string) {
    return this.tasks.filter(task =>
      (status === 'incomplete' ? !task.completed : task.completed) &&
      task.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  ngOnDestroy(): void {
    this.tasksSubscription.unsubscribe();
  }
}
