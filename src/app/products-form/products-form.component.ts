import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceProductsService } from '../service-products.service'; 

@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-form.component.html'
})
export class ProductsFormComponent implements OnInit {

  productForm: FormGroup;
  editMode: boolean = false; // false = crear, true = editar
  productId: number | null = null;

  constructor(private fb: FormBuilder, private productService: ServiceProductsService) {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      marca: [''],
      categoria: [''],
      precio: [0, Validators.required],
      existencias: [0, Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {}

  // Cargar producto para editar
  loadProduct(product: any) {
    this.editMode = true;
    this.productId = product.id;
    this.productForm.patchValue(product);
  }

  // Guardar producto
  submit() {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;

    if (this.editMode && this.productId) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: (res) => {
          console.log('Producto actualizado', res);
          this.resetForm();
        },
        error: (err) => console.error('Error al actualizar producto', err)
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: (res) => {
          console.log('Producto creado', res);
          this.resetForm();
        },
        error: (err) => console.error('Error al crear producto', err)
      });
    }
  }

  resetForm() {
    this.productForm.reset({ activo: true, precio: 0, existencias: 0 });
    this.editMode = false;
    this.productId = null;
  }
}
