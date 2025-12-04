import { Component } from '@angular/core';
import { Router, Event, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './login/login.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})

export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  mostrarNavbar = true;

  constructor(private readonly authService: AuthService, private readonly router: Router)  {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => {
        this.mostrarNavbar = !event.urlAfterRedirects.includes('/login');
      });
  }
}

