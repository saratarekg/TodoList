import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, query, getDocs, where } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import {ErrorHandlerService} from "../errorHandling/ErrorHandlingService";

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosCollection;

  constructor(private firestore: Firestore, private authService: AuthService, private errorHandler: ErrorHandlerService) {
    this.todosCollection = collection(this.firestore, 'todos');
  }

  private getUserId() {
    return this.authService.user.pipe(
      map(user => user ? user.id : null),
      catchError(error => {
        this.errorHandler.handleError(error);
        return of(undefined);
      })
    );
  }

  getTasks(){
    return this.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const q = query(this.todosCollection, where('userId', '==', userId));
          return from(getDocs(q)).pipe(
            map(snapshot =>
              snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }))
            ),
            catchError(error => {
              this.errorHandler.handleError(error);
              return of(undefined);
            })
          );
        } else {
          return of([]);
        }
      })
    );
  }

  addTask(text: string): Observable<void> {
    return this.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          return from(addDoc(this.todosCollection, { text, completed: false, userId })).pipe(
            map(() => {}),
            catchError(error => {
              this.errorHandler.handleError(error);
              return of(undefined);
            })
          );
        } else {
          return of(undefined);
        }
      })
    );
  }

  updateTask(id: string, data: any): Observable<void> {
    return this.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const taskDoc = doc(this.firestore, 'todos', id);
          return from(updateDoc(taskDoc, { ...data, userId }));
        } else {
          return of(undefined);
        }
      }),
      catchError(error => {
        this.errorHandler.handleError(error);
        return of(undefined);
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const taskDoc = doc(this.firestore, 'todos', id);
          return from(deleteDoc(taskDoc));
        } else {
          return of(undefined);
        }
      }),
      catchError(error => {
        this.errorHandler.handleError(error);
        return of(undefined);
      })
    );
  }

  toggleCompletion(id: string, completed: boolean): Observable<void> {
    return this.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          const taskDoc = doc(this.firestore, 'todos', id);
          return from(updateDoc(taskDoc, { completed, userId }));
        } else {
          return of(undefined);
        }
      }),
      catchError(error => {
        this.errorHandler.handleError(error);
        return of(undefined);
      })
    );
  }
}
