import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, query, getDocs } from '@angular/fire/firestore';
import {Observable, from} from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosCollection;

  constructor(private firestore: Firestore) {
    this.todosCollection = collection(this.firestore, 'todos');
  }

  getTasks(): Observable<any[]> {
    const q = query(this.todosCollection);
    return from(getDocs(q)).pipe(
      map(snapshot =>
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      )
    );
  }

  addTask(text: string): Observable<void> {
    return from(addDoc(this.todosCollection, { text, completed: false })).pipe(
      map(() => {})
    );
  }


  updateTask(id: string, data: any): Observable<void> {
    const taskDoc = doc(this.firestore, 'todos', id);
    return from(updateDoc(taskDoc, data));
  }

  deleteTask(id: string): Observable<void> {
    const taskDoc = doc(this.firestore, 'todos', id);
    return from(deleteDoc(taskDoc));
  }

  toggleCompletion(id: string, completed: boolean): Observable<void> {
    const taskDoc = doc(this.firestore, 'todos', id);
    return from(updateDoc(taskDoc, { completed }));
  }

}
