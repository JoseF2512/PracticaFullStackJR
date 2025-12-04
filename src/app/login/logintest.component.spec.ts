import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from './login.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      currentUser: of(null),
      login: jasmine.createSpy('login')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /products when user is logged in (ngOnInit)', () => {
    authServiceMock.currentUser = of({ email: 'test@test.com' });

    component.ngOnInit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should login successfully and navigate', async () => {
    authServiceMock.login.and.returnValue(Promise.resolve());

    component.user.email = 'test@test.com';
    component.user.password = '1234';

    await component.login();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
    expect(component.errorMessage).toBe('');
  });

  it('should set errorMessage on login error', async () => {
    authServiceMock.login.and.returnValue(Promise.reject(new Error('Login failed')));


    component.user.email = 'fail@test.com';
    component.user.password = 'wrong';

    await component.login();

    expect(component.errorMessage).toBe('Correo o contraseña incorrectos.');
  });
});
