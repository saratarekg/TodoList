import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AuthComponent } from './auth.component';
import { of, throwError } from 'rxjs';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'signup']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AuthComponent,ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should switch mode correctly', () => {
    component.onSwitchMode();
    expect(component.isLoginMode).toBe(false);
    component.onSwitchMode();
    expect(component.isLoginMode).toBe(true);
  });

  it('should submit the form and call login on AuthService', fakeAsync(() => {
    component.authForm.setValue({ email: 'test@example.com', password: 'password' });
    mockAuthService.login.and.returnValue(of());

    component.onSubmit();

    tick();
    expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
  }));

  it('should show an error message on login failure', fakeAsync(() => {
    component.authForm.setValue({ email: 'test@example.com', password: 'password' });
    mockAuthService.login.and.returnValue(throwError('Error'));

    component.onSubmit();

    tick();
    expect(component.error).toBe("An error occured!");
  }));

  it('should call signup on AuthService when in signup mode', fakeAsync(() => {
    component.isLoginMode = false;
    component.authForm.setValue({ email: 'test@example.com', password: 'password' });
    mockAuthService.signup.and.returnValue(of());

    component.onSubmit();

    tick();
    expect(mockAuthService.signup).toHaveBeenCalledWith('test@example.com', 'password');
  }));
});
