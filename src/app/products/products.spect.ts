import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './productstest.component';
import { ServiceProductsService } from '../service-products.service';
import { of, throwError } from 'rxjs';


describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productServiceMock: any;

  beforeEach(async () => {
    productServiceMock = {
      getProducts: jasmine.createSpy('getProducts'),
      updateProduct: jasmine.createSpy('updateProduct'),
      createProduct: jasmine.createSpy('createProduct'),
      toggleActive: jasmine.createSpy('toggleActive')
    };

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ServiceProductsService, useValue: productServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the products component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    const mockData = { content: [{ id: 1, nombre: 'Test' }] };
    productServiceMock.getProducts.and.returnValue(of(mockData));

    component.cargarProductos();

    expect(component.productos.length).toBe(1);
    expect(component.productosFiltrados.length).toBe(1);
  });

  it('should filter products', () => {
    component.productos = [
      { nombre: 'Laptop' },
      { nombre: 'Teclado' }
    ];

    component.filtroNombre = 'lap';
    component.filtrarProductos();

    expect(component.productosFiltrados.length).toBe(1);
    expect(component.productosFiltrados[0].nombre).toBe('Laptop');
  });

  it('should patch form when editing a product', () => {
    const product = { id: 5, nombre: 'Mouse' };

    component.editarProducto(product);

    expect(component.editMode).toBeTrue();
    expect(component.productId).toBe(5);
    expect(component.showForm).toBeTrue();
  });

  it('should submit new product successfully', () => {
    component.editMode = false;
    component.productForm.patchValue({ nombre: 'Nuevo' });

    productServiceMock.createProduct.and.returnValue(of({}));

    component.submit();

    expect(productServiceMock.createProduct).toHaveBeenCalled();
  });

  it('should handle submit error', () => {
    productServiceMock.createProduct.and.returnValue(throwError(() => 'error'));

    component.productForm.patchValue({ nombre: 'Error' });
    component.submit();

    expect(component.submitting).toBeFalse();
  });

  it('should reset form', () => {
    component.productForm.patchValue({ nombre: 'Test' });

    component.resetForm();

    expect(component.productForm.value.nombre).toBe(null);
    expect(component.editMode).toBeFalse();
  });
});
