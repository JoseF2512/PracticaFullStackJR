import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser = new BehaviorSubject<any>(null);
  currentUser = this._currentUser.asObservable();

  constructor() {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (token && email) {
      this._currentUser.next({ email });
    }
  }

  async login(email: string, password: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // ✅ Permitir cualquier correo y contraseña
        const token = 'TOKEN_SIMULADO_' + Math.random().toString(36).substring(2);
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        this._currentUser.next({ email });
        resolve();
      }, 700);
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this._currentUser.next(null);
  }
}
