import { Component, OnInit } from '@angular/core';
import { AuthService } from './login.service'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface LoginUser {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: LoginUser = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.router.navigate(['/products']);
      }
    });
  }

  async login() {
  try {
    await this.authService.login(this.user.email, this.user.password);
    this.errorMessage = '';
    this.router.navigate(['/products']); // solo al iniciar sesión correcto
  } catch (err) {
    this.errorMessage = "Correo o contraseña incorrectos.";
  }


    try {
      await this.authService.login(this.user.email, this.user.password);
      this.errorMessage = '';
      this.router.navigate(['/products']);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      this.errorMessage = "Correo o contraseña incorrectos.";
    }
  }
}
