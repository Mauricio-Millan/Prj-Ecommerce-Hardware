import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { 
  ProductModel, 
  CreateProductDto, 
  ProductFilters 
} from '../models/product.model';
import { CategoryModel } from '../models/category.model';
import { BrandModel } from '../models/brand.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/productos`;

  /**
   * Obtener todos los productos con portada
   * Endpoint: GET /api/productos/portada
   */
  getAllProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/portada`);
  }

  /**
   * Obtener un producto por ID
   * @param id - ID del producto
   */
  getProductById(id: number): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener productos filtrados por categoría
   * @param idCategoria - ID de la categoría
   */
  getProductsByCategory(idCategoria: number): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/categoria/${idCategoria}`);
  }

  /**
   * Obtener productos filtrados por marca
   * @param idMarca - ID de la marca
   */
  getProductsByBrand(idMarca: number): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/marca/${idMarca}`);
  }

  /**
   * Buscar productos por nombre o descripción
   * @param busqueda - Término de búsqueda
   */
  searchProducts(busqueda: string): Observable<ProductModel[]> {
    const params = new HttpParams().set('busqueda', busqueda);
    return this.http.get<ProductModel[]>(`${this.apiUrl}/buscar`, { params });
  }

  /**
   * Obtener todas las categorías
   * Endpoint: GET /api/categorias
   */
  getCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(`${environment.apiUrl}/categorias`);
  }

  /**
   * Obtener todas las marcas
   * Endpoint: GET /api/marcas
   */
  getBrands(): Observable<BrandModel[]> {
    return this.http.get<BrandModel[]>(`${environment.apiUrl}/marcas`);
  }

  /**
   * Crear un nuevo producto (solo admin)
   * @param product - Datos del producto a crear
   */
  createProduct(product: CreateProductDto): Observable<ProductModel> {
    return this.http.post<ProductModel>(this.apiUrl, product);
  }

  /**
   * Actualizar un producto existente (solo admin)
   * @param id - ID del producto
   * @param product - Datos actualizados del producto
   */
  updateProduct(id: number, product: Partial<CreateProductDto>): Observable<ProductModel> {
    return this.http.put<ProductModel>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Eliminar un producto (solo admin)
   * @param id - ID del producto a eliminar
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Construir URL completa de la imagen
   * @param imagenPortada - Ruta relativa de la imagen desde el backend
   */
  getImageUrl(imagenPortada: string): string {
    if (!imagenPortada) {
      return 'assets/placeholders/product-placeholder.png';
    }
    // Si la imagen ya tiene http/https, devolverla tal cual
    if (imagenPortada.startsWith('http')) {
      return imagenPortada;
    }
    // Construir URL completa desde el backend
    return `http://localhost:8080/REST-Ecommerce-Hardware${imagenPortada}`;
  }
}

