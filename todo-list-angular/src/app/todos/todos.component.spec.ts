import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {TodosComponent} from "./todos.component";
import {TodoService} from "../services/todo/todo.service";
import {of} from "rxjs";


describe('TodoComponent', () => {
  let fixture: any;
  let component: TodosComponent;
  let mockTodoService: jasmine.SpyObj<TodoService>;

  beforeEach(() => {
    mockTodoService = jasmine.createSpyObj('AuthService',
      [  'getTasks',
        'addTask',
        'updateTask',
        'deleteTask',
        'toggleCompletion']);
    TestBed.configureTestingModule({
      imports: [TodosComponent],
      providers: [
        { provide: TodoService, useValue: mockTodoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;

  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', fakeAsync(() => {
    const mockTasks = [
      { id: '1', text: 'Test Task 1', completed: false },
      { id: '2', text: 'Test Task 2', completed: true }
    ];
    mockTodoService.getTasks.and.returnValue(of(mockTasks));

    component.ngOnInit();
    fixture.detectChanges();
    tick();
    expect(component.tasks.length).toBe(2);
  }));

  it('should add task correctly', fakeAsync(() => {
    component.newTask = 'New Task';
    mockTodoService.addTask.and.returnValue(of(undefined));

    spyOn(component, 'loadTasks').and.callFake(() => {
      component.tasks.push({ text: "New Task", completed: false, id: 'mockId' });
    });

    component.addTask();

    tick();
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].text).toBe('New Task');
  }));

  it('should update task correctly', fakeAsync(() => {
    const taskToUpdate = { id: '1', text: 'Test Task', completed: false };
    component.tasks = [taskToUpdate];
    let updatedText= "Updated Task"
    component.newTask = 'New Task';

    mockTodoService.updateTask.and.returnValue(of(undefined));
    component.updateTask(taskToUpdate.id, updatedText);

    tick();
    expect(component.tasks[0].text).toBe(updatedText);
  }));

  it('should delete task correctly', fakeAsync(() => {
    const taskToDelete = { id: '1', text: 'Test Task', completed: false };
    component.tasks = [taskToDelete];

    mockTodoService.deleteTask.and.returnValue(of(undefined));
    component.deleteTask(taskToDelete.id);

    tick();
    expect(component.tasks.length).toBe(0);
  }));


  it('should toggle task correctly', () => {
    const taskToToggle = { id: '1', text: 'Test Task', completed: false };
    component.tasks = [taskToToggle];
    mockTodoService.toggleCompletion.and.returnValue(of(undefined));

    component.toggleCompletion(taskToToggle.id,true);

    expect(taskToToggle.completed).toBe(true);
  });


  it('should filter tasks correctly', () => {
    const mockTasks = [
      { id: '1', text: 'Test Task 1', completed: false },
      { id: '2', text: 'Test Task 2', completed: true }
    ];
    component.tasks = mockTasks;

    const incompleteTasks = component.filterTasks('incomplete', '');
    expect(incompleteTasks.length).toBe(1);
    const completedTasks = component.filterTasks('completed', '');
    expect(completedTasks.length).toBe(1);
  });

});
