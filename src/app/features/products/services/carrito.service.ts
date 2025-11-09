import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, throwError } from 'rxjs';
import { 
  CarritoModel, 
  CreateCarritoDto, 
  ItemCarritoModel, 
  CreateItemCarritoDto,
  CarritoConItemsModel 
} from '../models/carrito.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/REST-Ecommerce-Hardware/api';

  // Estado del carrito actual en memoria
  private carritoActual = signal<CarritoModel | null>(null);
  private itemsCount = signal<number>(0);

  /**
   * Obtener el carrito de un usuario
   */
  getCarritoByUsuario(usuarioId: number): Observable<CarritoModel | null> {
    return this.http.get<CarritoModel>(`${this.baseUrl}/carritos/usuario/${usuarioId}`).pipe(
      tap(carrito => {
        this.carritoActual.set(carrito);
        console.log('✅ Carrito encontrado:', carrito);
      }),
      catchError(error => {
        // Si el usuario no tiene carrito (404), retornamos null
        // El error.interceptor convierte el error, pero verificamos el mensaje
        if (error?.message?.includes('404') || error?.status === 404) {
          console.log('ℹ️ Usuario no tiene carrito, se debe crear uno');
          this.carritoActual.set(null);
          return of(null);
        }
        console.error('❌ Error al obtener carrito:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Crear un nuevo carrito para un usuario
   */
  createCarrito(dto: CreateCarritoDto): Observable<CarritoModel> {
    console.log('🛒 Creando carrito con DTO:', dto);
    return this.http.post<CarritoModel>(`${this.baseUrl}/carritos`, dto).pipe(
      tap(carrito => {
        this.carritoActual.set(carrito);
        console.log('✅ Carrito creado exitosamente:', carrito);
      }),
      catchError(error => {
        console.error('❌ Error al crear carrito:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Agregar un item al carrito
   */
  addItemToCarrito(dto: CreateItemCarritoDto): Observable<ItemCarritoModel> {
    console.log('➕ Agregando item al carrito con DTO:', dto);
    return this.http.post<ItemCarritoModel>(`${this.baseUrl}/items-carrito`, dto).pipe(
      tap(item => {
        this.itemsCount.update(count => count + dto.cantidad);
        console.log('✅ Item agregado al carrito exitosamente:', item);
      }),
      catchError(error => {
        console.error('❌ Error al agregar item al carrito:', error);
        console.error('   DTO enviado:', dto);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener todos los items de un carrito
   */
  getItemsByCarrito(carritoId: number): Observable<ItemCarritoModel[]> {
    return this.http.get<ItemCarritoModel[]>(`${this.baseUrl}/items-carrito/carrito/${carritoId}`).pipe(
      tap(items => {
        const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
        this.itemsCount.set(totalItems);
        console.log('✅ Items del carrito obtenidos:', items);
      }),
      catchError(error => {
        console.error('❌ Error al obtener items del carrito:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualizar cantidad de un item
   */
  updateItemQuantity(itemId: number, cantidad: number): Observable<ItemCarritoModel> {
    return this.http.put<ItemCarritoModel>(`${this.baseUrl}/items-carrito/${itemId}`, { cantidad }).pipe(
      tap(item => {
        console.log('✅ Cantidad de item actualizada:', item);
      }),
      catchError(error => {
        console.error('❌ Error al actualizar cantidad:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Eliminar un item del carrito
   */
  removeItemFromCarrito(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/items-carrito/${itemId}`).pipe(
      tap(() => {
        console.log('✅ Item eliminado del carrito');
      }),
      catchError(error => {
        console.error('❌ Error al eliminar item:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Vaciar todo el carrito
   */
  clearCarrito(carritoId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/carritos/${carritoId}`).pipe(
      tap(() => {
        this.carritoActual.set(null);
        this.itemsCount.set(0);
        console.log('✅ Carrito vaciado');
      }),
      catchError(error => {
        console.error('❌ Error al vaciar carrito:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtener el carrito actual del estado
   */
  getCurrentCarrito() {
    return this.carritoActual.asReadonly();
  }

  /**
   * Obtener el contador de items
   */
  getItemsCount() {
    return this.itemsCount.asReadonly();
  }

  /**
   * Limpiar el estado del carrito
   */
  resetCarritoState(): void {
    this.carritoActual.set(null);
    this.itemsCount.set(0);
  }
}
