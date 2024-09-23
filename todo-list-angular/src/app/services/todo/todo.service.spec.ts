import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import {
  collection as firestoreCollection,
  Firestore,
  getDocs,
  query,
  where,
  CollectionReference,
  DocumentData, getFirestore, provideFirestore
} from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { ErrorHandlerService } from '../errorHandling/ErrorHandlingService';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../auth/user.model';
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {environment} from "../../../environments/environment";

describe('TodoService', () => {
  let service: TodoService;
  let mockFirestore: jasmine.SpyObj<Firestore>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandlerService>;

  const userId = '12345';
  const user = new User('email', userId, 'token', new Date());

  beforeEach(() => {
    mockFirestore = jasmine.createSpyObj('Firestore', ['']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['user']);
    mockErrorHandler = jasmine.createSpyObj('ErrorHandlerService', ['handleError']);

    mockAuthService.user = new BehaviorSubject<User | null>(user);

    TestBed.configureTestingModule({
      providers: [
        TodoService,
        { provide: Firestore, useValue: mockFirestore },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideFirestore(() => getFirestore()),
      ],
    });

    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  // it('should return tasks for the current user', (done) => {
  //   const mockTasks = [
  //     { id: '1', text: 'Task 1', completed: false, userId },
  //     { id: '2', text: 'Task 2', completed: true, userId },
  //   ];
  //
  //   const mockCollectionRef = {} as CollectionReference<DocumentData>;
  //
  //   spyOn<any>(firestoreCollection, 'apply').and.callFake((firestore: Firestore, collectionPath: string) => {
  //     if (collectionPath === 'todos') {
  //       return mockCollectionRef;
  //     }
  //     return undefined;
  //   });
  //
  //   spyOn<any>(getDocs, 'apply').and.returnValue(Promise.resolve({
  //     docs: mockTasks.map(task => ({
  //       id: task.id,
  //       data: () => ({ text: task.text, completed: task.completed, userId: task.userId }),
  //     })),
  //   }));
  //
  //   service.getTasks().subscribe(tasks => {
  //     // Check if the tasks match the mockTasks
  //     expect(tasks).toEqual(mockTasks.map(task => ({
  //       id: task.id,
  //       text: task.text,
  //       completed: task.completed,
  //       userId: task.userId,
  //     })));
  //
  //     done();
  //   });
  // });


  // it('should handle error when getting tasks', (done) => {
  //   const mockError = new Error('Test error');
  //
  //   // Spy on getDocs to throw an error
  //   spyOn<any>(getDocs, 'apply').and.returnValue(Promise.reject(mockError));
  //
  //   service.getTasks().subscribe(tasks => {
  //     // Check if the result is undefined due to the error
  //     expect(tasks).toEqual(undefined);
  //
  //     // Ensure the error handler was called with the correct error
  //     expect(mockErrorHandler.handleError).toHaveBeenCalledWith(mockError);
  //
  //     done();
  //   });
  // });


  it('should return an empty array if userId is not available', (done) => {
    mockAuthService.user.next(null);

    service.getTasks().subscribe(tasks => {
      expect(tasks).toEqual([]);
      done();
    });
  });
});
