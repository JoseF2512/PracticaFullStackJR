import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ServiceProductsService } from '../service-products.service'; 

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']

})
export class ProductsComponent implements OnInit {

  productos: any[] = [];
  productosFiltrados: any[] = [];
  productForm: FormGroup;
  editMode: boolean = false;
  productId: number | null = null;
  filtroNombre: string = '';

  loading: boolean = false;
  submitting: boolean = false;

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

  mostrarForm = false;
  showForm: boolean = false;

toggleForm() {
  this.showForm = !this.showForm;
  if (!this.showForm) {
    this.resetForm(); // opcional: resetear al cerrar
  }
}
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

  filtrarProductos() {
    if (!this.filtroNombre) {
      this.productosFiltrados = [...this.productos];
    } else {
      const filtro = this.filtroNombre.toLowerCase();
      this.productosFiltrados = this.productos.filter(p =>
        p.nombre.toLowerCase().includes(filtro)
      );
    }
  }

  editarProducto(product: any) {
    this.showForm = true; 
    this.editMode = true;
    this.productId = product.id;
    this.productForm.patchValue(product);
  }

  submit() {
  if (this.productForm.invalid) return;

  this.submitting = true;
  const productData = this.productForm.value;

  const isEdit = this.editMode; 

  const action$ = isEdit && this.productId
    ? this.productService.updateProduct(this.productId, productData)
    : this.productService.createProduct(productData);

  action$.subscribe({
    next: () => {
      this.resetForm(); 
      this.cargarProductos();
      this.submitting = false;
      Swal.fire(
        'Éxito',
        isEdit ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.',
        'success'
      );
    },
    error: (err) => {
      this.submitting = false;
      Swal.fire('Error', 'No se pudo guardar el producto.', 'error');
      console.error(err);
    }
  });
}

toggleActivo(product: any) {
  const accion = product.activo ? 'desactivar' : 'activar';
  const mensajeExito = product.activo ? 'desactivado' : 'activado'; 

  Swal.fire({
    title: `¿Desea ${accion} este producto?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then(result => {
    if (result.isConfirmed) {
      this.submitting = true;
      this.productService.toggleActive(product.id).subscribe({
        next: () => {
          this.cargarProductos();
          this.submitting = false;
          Swal.fire('Éxito', `Producto ${mensajeExito} correctamente.`, 'success');
        },
        error: (err) => {
          this.submitting = false;
          Swal.fire('Error', `No se pudo ${accion} el producto.`, 'error');
          console.error(err);
        }
      });
    }
  });
}

cancelForm() {
  this.resetForm();  // Limpia los campos del formulario
  this.showForm = false; // Oculta el formulario
}

  resetForm() {
    this.productForm.reset({ activo: true, precio: 0, existencias: 0 });
    this.editMode = false;
    this.productId = null;
  }
}
