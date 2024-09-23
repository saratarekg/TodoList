import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from "./services/auth/auth.service";

describe('AppComponent', () => {
  let fixture: any;
  let app: AppComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(fakeAsync(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['autoLogin', 'logout']);
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    tick();
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should call displayDate and show it correctly`, () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const expectedDate = today.toLocaleDateString('en-US', options);
    app.displayDate();
    expect(app.date).toEqual(expectedDate);
  });

  it('should render date in correct template', () => {
    app.displayDate();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#current-date')?.textContent).toContain(app.date);
  });

  it('should call authService.autoLogin() on init', () => {
    app.ngOnInit();
    expect(mockAuthService.autoLogin).toHaveBeenCalled();
  });

  it('should call authService.logout() when Logout is called', () => {
    app.Logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
