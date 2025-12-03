Frontend - CRUD de Productos (Angular 17)
Descripción

Este proyecto es el frontend que desarrollé en Angular 17 para gestionar productos mediante un CRUD completo. Permite crear, listar, editar, eliminar, activar/desactivar productos y ajustar inventario. Se conecta con un backend REST desarrollado en Spring Boot.

Tecnologías utilizadas

Angular 17

TypeScript

HTML5 & CSS3

RxJS para manejar observables

SweetAlert2 para notificaciones

Bootstrap / Tailwind CSS según implementación

Estructura del proyecto
frontend/
│
├─ src/
│  ├─ app/
│  │  ├─ login/                  # Componentes y lógica de login
│  │  ├─ products/               # CRUD de productos
│  │  │  ├─ products.component.ts
│  │  │  ├─ products.component.html
│  │  │  ├─ products.component.css
│  │  │  └─ products.routes.ts   # Rutas internas del módulo de productos
│  │  ├─ products-form/          # Formularios para crear/editar productos
│  │  ├─ service-products.service.ts   # Servicio para consumir el backend
│  │  ├─ service-products.service.spec.ts # Tests del servicio
│  │  ├─ app.component.ts
│  │  ├─ app.component.html
│  │  └─ app.routes.ts           # Rutas principales
│  ├─ assets/
│  └─ styles.css
├─ angular.json
├─ package.json
├─ package-lock.json
└─ tsconfig.json

Instalación

Clonar el repositorio:

git clone <url-del-repo>
cd <carpeta-del-proyecto>


Instalar dependencias:

npm install


Ejecutar la aplicación:

ng serve


La app correrá en: http://localhost:4200

Uso

Listar productos: La página principal muestra todos los productos con paginación.

Crear producto: Formulario para agregar un nuevo producto.

Editar producto: Botón de editar en la lista para modificar un producto.

Eliminar producto: Botón de eliminar en la lista.

Activar/Desactivar producto: Botón para cambiar estado activo.

Ajustar inventario: Formulario para sumar o restar existencias.

Filtrado: Búsqueda por nombre de producto en tiempo real.

ProductsComponent

Este componente maneja toda la lógica del CRUD y el formulario reactivo para crear o editar productos.

Características principales:

Listado y filtrado por nombre.

Formulario reactivo con validaciones: nombre obligatorio, precio y existencias ≥ 0.

Modo edición para actualizar productos existentes.

Activar/desactivar productos con confirmación mediante SweetAlert2.

Notificaciones de éxito o error al crear, editar, eliminar o cambiar estado.

Indicadores de carga y envío para mejorar la experiencia del usuario.

Ejemplo resumido del componente:

productos: any[] = [];
productosFiltrados: any[] = [];
productForm: FormGroup;
editMode = false;
productId: number | null = null;
filtroNombre = '';
loading = false;
submitting = false;

constructor(private fb: FormBuilder, private productService: ServiceProductsService) {
  this.productForm = this.fb.group({
    nombre: ['', Validators.required],
    marca: [''],
    categoria: [''],
    precio: [0, [Validators.required, Validators.min(0)]],
    existencias: [0, [Validators.required, Validators.min(0)]],
    activo: [true]
  });
}

ngOnInit(): void {
  this.cargarProductos();
}

ServiceProductsService

Servicio Angular encargado de comunicarse con el backend y manejar todas las operaciones CRUD.

@Injectable({
  providedIn: 'root'
})
export class ServiceProductsService {
  private apiUrl = 'http://localhost:8080/productos'; 

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
  getProductById(id: number): Observable<any> { return this.http.get<any>(`${this.apiUrl}/${id}`); }
  createProduct(producto: any): Observable<any> { return this.http.post<any>(this.apiUrl, producto); }
  updateProduct(id: number, producto: any): Observable<any> { return this.http.put<any>(`${this.apiUrl}/${id}`, producto); }
  toggleActive(id: number): Observable<any> { return this.http.patch<any>(`${this.apiUrl}/${id}/activar`, {}); }
  deleteProduct(id: number): Observable<any> { return this.http.delete<any>(`${this.apiUrl}/${id}`); }
}

Notas

Tipo de datos y validaciones:
El formulario reactivo (FormGroup) incluye validaciones para evitar datos incorrectos, como nombre obligatorio, precio y existencias mayores o iguales a 0. Esto asegura integridad antes de enviar los datos al backend.

Manejo de errores:
Todos los métodos del servicio y del componente usan subscribe y SweetAlert2 para notificar errores. Por ejemplo:

cargarProductos() {
  this.loading = true;
  this.productService.getProducts().subscribe({
    next: (res: any) => {
      this.productos = res.content;
      this.filtrarProductos();
      this.loading = false;
    },
    error: (err) => {
      this.loading = false;
      Swal.fire('Error', 'No se pudieron cargar los productos.', 'error');
      console.error(err);
    }
  });
}


Indicadores de carga y envío:
Se usan loading y submitting para mostrar spinners o deshabilitar botones mientras se realizan operaciones.

Toggle de estado activo/inactivo:
Se confirma con un modal de SweetAlert2 antes de activar o desactivar productos.

Filtrado de productos:
Búsqueda en tiempo real por nombre, insensible a mayúsculas/minúsculas.

Reseteo del formulario:
Al cancelar o enviar, se limpia el formulario y se reinicia el modo edición.

Modularidad y extensibilidad:
El servicio es reutilizable y se puede expandir para añadir filtros avanzados, paginación, exportación de datos, gestión de usuarios, etc.

Compatibilidad y buenas prácticas:

Standalone components.

Nomenclatura consistente de componentes, servicios y rutas.

CSS modular por componente.


*Prueba SonarQube.

Se realizo la prueba en SonarQube con resultados positivos y los esperados.
comparto evidencia: ![prueba](image.png)