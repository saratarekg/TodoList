import {TodosComponent} from "./todos/todos.component";
import {AuthComponent} from "./auth/auth.component";


import { Routes } from '@angular/router';
import {AuthGuard} from "./auth/auth.guard";

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'auth', loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent) },
  { path: 'todos', loadComponent: () => import('./todos/todos.component').then(m => m.TodosComponent),canActivate: [AuthGuard] },
];
