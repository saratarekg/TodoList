import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';


describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;
  const mockUserData = {
    email: 'test@example.com',
    localId: '12345',
    idToken: 'token123',
    expiresIn: '3600',
  };

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('userData');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should signup and handle authentication', () => {
    service.signup('test@example.com', 'password123').subscribe(user => {
      expect(user).toBeTruthy();
      expect(service.user.getValue()).toEqual(jasmine.objectContaining({
        email: mockUserData.email,
        id: mockUserData.localId,
      }));
      expect(localStorage.getItem('userData')).toBeTruthy();
    });

    const req = httpMock.expectOne('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDBGKNL5SefEi9ZtBKnod8KaEwuW3z8G2A');
    expect(req.request.method).toBe('POST');
    req.flush(mockUserData);
  });

  it('should login and handle authentication', () => {
    service.login('test@example.com', 'password123').subscribe(user => {
      expect(user).toBeTruthy();
      expect(service.user.getValue()).toEqual(jasmine.objectContaining({
        email: mockUserData.email,
        id: mockUserData.localId,
      }));
      expect(localStorage.getItem('userData')).toBeTruthy();
    });

    const req = httpMock.expectOne('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDBGKNL5SefEi9ZtBKnod8KaEwuW3z8G2A');
    expect(req.request.method).toBe('POST');
    req.flush(mockUserData);
  });


  it('should auto-login if user data exists', () => {
    const userData = {
      email: 'test@example.com',
      id: '12345',
      _token: 'token123',
      _tokenExpirationDate: new Date(new Date().getTime() + 3600 * 1000).toISOString(),
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    service.autoLogin();
    expect(service.user.getValue()).toEqual(jasmine.objectContaining({
      email: userData.email,
      id: userData.id,
    }));
  });

  it('should not auto-login if no user data', () => {
    service.autoLogin();
    expect(service.user.getValue()).toBeNull();
  });

  it('should logout and navigate to /auth', () => {
    service.logout();
    expect(service.user.getValue()).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
    expect(localStorage.getItem('userData')).toBeNull();
  });

});


