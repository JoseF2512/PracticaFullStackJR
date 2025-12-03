import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceProductsService {

  private apiUrl = 'http://localhost:8080/productos'; 

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener producto por ID
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear un producto
  createProduct(producto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, producto);
  }

  // Actualizar un producto
  updateProduct(id: number, producto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, producto);
  }

  // Activar/desactivar producto
  toggleActive(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/activar`, {});
  }

  // Eliminar producto
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
