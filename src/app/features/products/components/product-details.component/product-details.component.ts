import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductoImagenService } from '../../services/producto-imagen.service';
import { CarritoService } from '../../services/carrito.service';
import { LoginService } from '../../../auth/services/login.service';
import { ProductModel } from '../../models/product.model';
import { ProductoImagenModel } from '../../models/producto-imagen.model';
import { CreateCarritoDto, CreateItemCarritoDto } from '../../models/carrito.model';
import { ProductReviewComponent } from '../product-review.component/product-review.component';
import { forkJoin, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductReviewComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private productoImagenService = inject(ProductoImagenService);
  private carritoService = inject(CarritoService);
  private loginService = inject(LoginService);

  // Estado
  product = signal<ProductModel | null>(null);
  productImages = signal<ProductoImagenModel[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  selectedImageIndex = signal<number>(0);
  quantity = signal<number>(1);
  addingToCart = signal<boolean>(false);

  /**
   * Obtener usuario actual
   */
  get currentUser() {
    return this.loginService.currentUser();
  }

  get isLoggedIn() {
    return this.loginService.isLoggedIn();
  }

  // Imágenes (galería ordenada)
  get allImages(): string[] {
    const images = this.productImages();
    if (images.length === 0) {
      // Fallback a imagen de portada del producto
      const prod = this.product();
      if (prod?.imagenPortada) {
        return [this.productService.getImageUrl(prod.imagenPortada)];
      }
      return ['assets/placeholders/product-placeholder.png'];
    }
    
    // Ordenar por: principal primero, luego por orden
    const sortedImages = [...images].sort((a, b) => {
      if (a.esPrincipal && !b.esPrincipal) return -1;
      if (!a.esPrincipal && b.esPrincipal) return 1;
      return a.orden - b.orden;
    });
    
    return sortedImages.map(img => this.productoImagenService.getImageUrl(img.urlImagen));
  }

  ngOnInit(): void {
    // Obtener el ID del producto desde la ruta
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadProduct(id);
      } else {
        this.error.set('ID de producto inválido');
        this.loading.set(false);
      }
    });
  }

  /**
   * Cargar información del producto e imágenes
   */
  loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      product: this.productService.getProductById(id),
      images: this.productoImagenService.getImagenesByProducto(id)
    }).subscribe({
      next: ({ product, images }) => {
        this.product.set(product);
        this.productImages.set(images);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.error.set('No se pudo cargar el producto. Intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }

  /**
   * Cambiar imagen seleccionada en la galería
   */
  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  /**
   * Incrementar cantidad
   */
  increaseQuantity(): void {
    const prod = this.product();
    if (prod && this.quantity() < prod.stock) {
      this.quantity.update(q => q + 1);
    }
  }

  /**
   * Decrementar cantidad
   */
  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  /**
   * Agregar al carrito
   */
  async addToCart(): Promise<void> {
    const prod = this.product();
    
    // Validaciones
    if (!prod) {
      return;
    }

    if (prod.stock === 0) {
      alert('Este producto está agotado');
      return;
    }

    if (!this.isLoggedIn || !this.currentUser) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    if (this.quantity() > prod.stock) {
      alert(`Solo hay ${prod.stock} unidades disponibles`);
      return;
    }

    this.addingToCart.set(true);

    try {
      // Obtener usuario actual del signal
      const user = this.currentUser;
      console.log('👤 Usuario actual completo:', user);
      console.log('👤 Tipo de usuario:', typeof user);
      console.log('👤 Usuario es null?:', user === null);
      
      if (!user || !user.id) {
        alert('❌ Error: No se pudo obtener el usuario. Intenta iniciar sesión nuevamente.');
        this.addingToCart.set(false);
        return;
      }
      
      const usuarioId = user.id;
      console.log('🆔 ID del usuario:', usuarioId);

      // 1. Verificar si el usuario tiene un carrito
      let carrito = await firstValueFrom(this.carritoService.getCarritoByUsuario(usuarioId));

      // 2. Si no tiene carrito, crear uno
      if (!carrito) {
        console.log('🛒 Creando nuevo carrito para usuario ID:', usuarioId);
        const createCarritoDto: CreateCarritoDto = {
          idUsuario: { id: usuarioId }
        };
        console.log('📦 DTO de creación:', JSON.stringify(createCarritoDto));
        carrito = await firstValueFrom(this.carritoService.createCarrito(createCarritoDto));
        console.log('✅ Carrito creado:', carrito);
      }

      // 3. Agregar el producto al carrito con la cantidad seleccionada
      const createItemDto: CreateItemCarritoDto = {
        idCarrito: { id: carrito.id },
        idProducto: { id: prod.id },
        cantidad: this.quantity()
      };

      await firstValueFrom(this.carritoService.addItemToCarrito(createItemDto));

      alert(`✅ ${this.quantity()}x ${prod.nombre} agregado al carrito`);
      
      // Resetear cantidad a 1
      this.quantity.set(1);
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      alert('❌ Error al agregar el producto al carrito. Intenta de nuevo.');
    } finally {
      this.addingToCart.set(false);
    }
  }

  /**
   * Comprar ahora
   */
  buyNow(): void {
    const prod = this.product();
    if (prod) {
      // TODO: Redirigir a checkout
      alert(`Comprar ahora: ${this.quantity()}x ${prod.nombre}`);
    }
  }

  /**
   * Volver al catálogo
   */
  goBack(): void {
    this.router.navigate(['/catalogo']);
  }

  /**
   * Formatear precio en Soles Peruanos (PEN)
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  }
}
