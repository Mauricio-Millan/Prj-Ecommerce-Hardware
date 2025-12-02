import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CarritoService } from '../../../products/services/carrito.service';
import { CarritoStateService } from '../../../products/services/carrito-state.service';
import { LoginService } from '../../../auth/services/login.service';
import { PedidoService } from '../../../products/services/pedido.service';
import { ItemCarritoModel } from '../../../products/models/carrito.model';
import { CreatePedidoDto, CreateItemPedidoDto } from '../../../products/models/pedido.model';
import { firstValueFrom } from 'rxjs';

type PaymentMethod = 'card' | 'paypal';

interface CardFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css'
})
export class PagoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private carritoService = inject(CarritoService);
  private carritoStateService = inject(CarritoStateService);
  private loginService = inject(LoginService);
  private pedidoService = inject(PedidoService);

  // Estado
  selectedPaymentMethod = signal<PaymentMethod>('card');
  loading = signal<boolean>(true);
  processing = signal<boolean>(false);
  items = signal<ItemCarritoModel[]>([]);
  carritoId = signal<number | null>(null);
  
  // Formularios
  shippingForm!: FormGroup;
  cardForm!: FormGroup;

  // Usuario actual
  get currentUser() {
    return this.loginService.currentUser();
  }

  get isLoggedIn() {
    return this.loginService.isLoggedIn();
  }

  // Calcular totales
  get subtotal(): number {
    return this.items().reduce((sum, item) => sum + (item.subtotal || 0), 0);
  }

  get shipping(): number {
    return 0; // Envío gratis
  }

  get tax(): number {
    // El IGV ya está incluido en el precio, calcularlo: precio / 1.18 * 0.18
    return this.subtotal - (this.subtotal / 1.18);
  }

  get total(): number {
    // El total es el subtotal (que ya incluye IGV) + envío
    return this.subtotal + this.shipping;
  }

  ngOnInit(): void {
    if (!this.isLoggedIn || !this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.initForms();
    this.loadCartItems();
  }

  /**
   * Inicializar formularios
   */
  initForms(): void {
    // Formulario de envío
    this.shippingForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      country: ['Perú', Validators.required]
    });

    // Formulario de tarjeta
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      cardName: ['', [Validators.required, Validators.minLength(3)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]]
    });

    // Prellenar con datos del usuario
    if (this.currentUser) {
      this.shippingForm.patchValue({
        fullName: `${this.currentUser.nombre} ${this.currentUser.apellido}`,
        email: this.currentUser.correoElectronico,
        country: 'Perú'
      });
    }
  }

  /**
   * Cargar items del carrito
   */
  async loadCartItems(): Promise<void> {
    this.loading.set(true);
    try {
      // 1. Intentar obtener items del servicio compartido (si viene desde el carrito)
      const itemsFromState = this.carritoStateService.getSelectedItems();
      
      if (itemsFromState && itemsFromState.length > 0) {
        console.log('✅ Items cargados desde el estado compartido:', itemsFromState.length);
        this.items.set(itemsFromState);
        
        // Obtener el ID del carrito
        if (itemsFromState[0]?.idCarrito) {
          this.carritoId.set(itemsFromState[0].idCarrito);
        }
        
        this.loading.set(false);
        return;
      }

      // 2. Si no hay items en el estado, cargar desde el backend
      console.log('� Cargando items desde el backend...');
      const usuarioId = this.currentUser!.id;
      console.log('🛒 Usuario ID:', usuarioId);
      
      const carrito = await firstValueFrom(this.carritoService.getCarritoByUsuario(usuarioId));
      
      if (!carrito) {
        console.warn('⚠️ No se encontró carrito para el usuario');
        alert('No tienes productos en el carrito. Serás redirigido al catálogo.');
        this.router.navigate(['/catalogo']);
        return;
      }

      console.log('✅ Carrito encontrado:', carrito.id);
      this.carritoId.set(carrito.id);
      
      const items = await firstValueFrom(this.carritoService.getItemsByCarrito(carrito.id));
      console.log('📦 Items del backend:', items);
      
      if (!items || items.length === 0) {
        console.warn('⚠️ No hay items en el carrito');
        alert('No tienes productos en el carrito. Serás redirigido al catálogo.');
        this.router.navigate(['/catalogo']);
        return;
      }

      // Si no vienen desde el componente carrito, mostrar todos los items
      console.log('✅ Mostrando todos los items del carrito:', items.length);
      this.items.set(items);
      
    } catch (error) {
      console.error('❌ Error al cargar items:', error);
      alert('Error al cargar los productos del carrito. Por favor intenta nuevamente.');
      this.router.navigate(['/carrito']);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Seleccionar método de pago
   */
  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod.set(method);
  }

  /**
   * Formatear número de tarjeta
   */
  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\s/g, '');
    
    if (value.length > 16) {
      value = value.substring(0, 16);
    }
    
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardForm.patchValue({ cardNumber: value }, { emitEvent: false });
    input.value = formatted;
  }

  /**
   * Formatear fecha de expiración
   */
  formatExpiryDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    input.value = value;
    this.cardForm.patchValue({ expiryDate: value });
  }

  /**
   * Muestra cuadro de confirmación antes de procesar el pago
   */
  confirmPayment(): void {
    if (this.processing()) return;

    const confirmed = window.confirm(
      'La compra sera realizada, sus datos de contacto seran el medio por donde le informaremos sobre el estado de su pedido.\n\n¿Desea continuar?'
    );

    if (confirmed) {
      this.processPayment();
    }
  }

  /**
   * Procesar pago
   */
  async processPayment(): Promise<void> {
    // Validar formulario de envío
    if (this.shippingForm.invalid) {
      this.markFormGroupTouched(this.shippingForm);
      alert('Por favor completa todos los campos de envío');
      return;
    }

    // Validar según método de pago
    if (this.selectedPaymentMethod() === 'card') {
      if (this.cardForm.invalid) {
        this.markFormGroupTouched(this.cardForm);
        alert('Por favor completa todos los campos de la tarjeta');
        return;
      }
    }

    // Validar que haya items
    if (this.items().length === 0) {
      alert('No hay productos en el carrito');
      return;
    }

    this.processing.set(true);

    try {
      // 1. Crear el pedido en el backend
      const pedidoData: CreatePedidoDto = {
        idUsuario: {
          id: this.currentUser!.id
        },
        montoTotal: this.total,
        estado: 'PENDIENTE', // Estado inicial del pedido
        direccionEnvio: this.shippingForm.value.address,
        ciudadEnvio: this.shippingForm.value.city,
        paisEnvio: this.shippingForm.value.country,
        codigoPostalEnvio: this.shippingForm.value.zipCode
      };

      console.log('📦 Creando pedido...', pedidoData);
      const pedidoCreado = await firstValueFrom(this.pedidoService.createPedido(pedidoData));
      
      if (!pedidoCreado) {
        throw new Error('No se pudo crear el pedido');
      }

      console.log('✅ Pedido creado:', pedidoCreado.id);

      // 2. Crear los items del pedido
      const itemsPromises = this.items().map(item => {
        const itemPedido: CreateItemPedidoDto = {
          idPedido: {
            id: pedidoCreado.id
          },
          idProducto: {
            id: item.idProducto
          },
          cantidad: item.cantidad,
          precioUnitario: item.precioProducto
        };
        return firstValueFrom(this.pedidoService.createItemPedido(itemPedido));
      });

      await Promise.all(itemsPromises);
      console.log('✅ Items del pedido creados');

      // 3. Limpiar el carrito (eliminar items comprados)
      if (this.carritoId()) {
        await this.clearPurchasedItems();
      }

      // 4. Limpiar el estado compartido
      this.carritoStateService.clearSelectedItems();

      // 5. Mostrar éxito y redirigir
      alert(`¡Pago procesado exitosamente!\n\nNúmero de pedido: ${pedidoCreado.id}\nTotal: ${this.formatPrice(this.total)}\n\nRecibirás un correo con la confirmación.`);
      this.router.navigate(['/catalogo']);
    } catch (error) {
      console.error('❌ Error al procesar pago:', error);
      alert('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      this.processing.set(false);
    }
  }

  /**
   * Limpiar items comprados del carrito
   */
  private async clearPurchasedItems(): Promise<void> {
    try {
      const deletePromises = this.items().map(item => 
        firstValueFrom(this.carritoService.removeItemFromCarrito(item.id))
      );
      await Promise.all(deletePromises);
      console.log('🗑️ Items comprados eliminados del carrito');
    } catch (error) {
      console.error('⚠️ Error al limpiar carrito:', error);
      // No lanzar error aquí, el pedido ya se creó exitosamente
    }
  }

  /**
   * Marcar todos los campos del formulario como tocados
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Formatear precio
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  }

  /**
   * Obtener imagen del producto
   */
  getProductImage(imagePath: string | undefined): string {
    if (!imagePath) return 'assets/placeholders/product-placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8080/REST-Ecommerce-Hardware${imagePath}`;
  }

  /**
   * Volver al carrito
   */
  goBack(): void {
    this.router.navigate(['/carrito']);
  }
}
