import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResenaService } from '../../services/resena.service';
import { LoginService } from '../../../auth/services/login.service';
import { ResenaModel, CreateResenaDto, ResenaStats } from '../../models/resena.model';

@Component({
  selector: 'app-product-review',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './product-review.component.html',
  styleUrl: './product-review.component.css'
})
export class ProductReviewComponent implements OnInit {
  @Input({ required: true }) productId!: number;

  private resenaService = inject(ResenaService);
  private loginService = inject(LoginService);
  private fb = inject(FormBuilder);

  // Estado
  resenas = signal<ResenaModel[]>([]);
  stats = signal<ResenaStats | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  showForm = signal<boolean>(false);
  submitting = signal<boolean>(false);

  // Formulario de reseña
  reviewForm: FormGroup = this.fb.group({
    calificacion: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comentario: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  });

  // Exponer Math para template
  Math = Math;

  // Usuario actual
  get currentUser() {
    return this.loginService.currentUser();
  }

  get isLoggedIn() {
    return this.loginService.isLoggedIn();
  }

  ngOnInit(): void {
    this.loadResenas();
  }

  /**
   * Cargar reseñas del producto
   */
  loadResenas(): void {
    this.loading.set(true);
    this.error.set(null);

    this.resenaService.getResenasByProducto(this.productId).subscribe({
      next: (resenas) => {
        this.resenas.set(resenas);
        // Calcular estadísticas localmente desde las reseñas
        this.calculateStats(resenas);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar reseñas:', err);
        this.error.set('Error al cargar las reseñas');
        this.loading.set(false);
      }
    });
  }

  /**
   * Calcular estadísticas localmente desde las reseñas
   */
  private calculateStats(resenas: ResenaModel[]): void {
    if (resenas.length === 0) {
      this.stats.set(null);
      return;
    }

    const totalResenas = resenas.length;
    const sumaCalificaciones = resenas.reduce((sum, r) => sum + r.calificacion, 0);
    const promedioCalificacion = sumaCalificaciones / totalResenas;

    // Contar distribución por estrellas
    const distribucion = {
      estrellas5: resenas.filter(r => r.calificacion === 5).length,
      estrellas4: resenas.filter(r => r.calificacion === 4).length,
      estrellas3: resenas.filter(r => r.calificacion === 3).length,
      estrellas2: resenas.filter(r => r.calificacion === 2).length,
      estrellas1: resenas.filter(r => r.calificacion === 1).length,
    };

    this.stats.set({
      promedioCalificacion,
      totalResenas,
      distribucion
    });
  }

  /**
   * Mostrar/ocultar formulario de reseña
   */
  toggleForm(): void {
    if (!this.isLoggedIn) {
      alert('Debes iniciar sesión para escribir una reseña');
      return;
    }
    this.showForm.update(v => !v);
    if (this.showForm()) {
      this.reviewForm.reset({ calificacion: 5, comentario: '' });
    }
  }

  /**
   * Enviar reseña
   * Solo envía: idProducto, idUsuario, calificacion y comentario
   * El campo creadoEn se genera automáticamente en el backend
   */
  submitReview(): void {
    if (this.reviewForm.invalid || !this.currentUser) {
      return;
    }

    this.submitting.set(true);

    // DTO según estructura del backend
    const newResena: CreateResenaDto = {
      idProducto: {
        id: this.productId
      },
      idUsuario: {
        id: this.currentUser.id
      },
      calificacion: this.reviewForm.value.calificacion,
      comentario: this.reviewForm.value.comentario
    };

    this.resenaService.createResena(newResena).subscribe({
      next: (resena) => {
        // Completar datos del usuario si no vienen del backend
        if (!resena.usuario || !resena.usuario.nombre) {
          resena.usuario = {
            id: this.currentUser!.id,
            nombre: this.currentUser!.nombre,
            apellido: this.currentUser!.apellido
          };
        }
        
        // Asegurar que la fecha esté presente (usar fecha actual si no viene del backend)
        if (!resena.fechaCreacion) {
          resena.fechaCreacion = new Date().toISOString();
        }
        
        // Agregar la nueva reseña al inicio
        const updatedResenas = [resena, ...this.resenas()];
        this.resenas.set(updatedResenas);
        
        // Recalcular estadísticas
        this.calculateStats(updatedResenas);

        // Limpiar formulario y ocultarlo
        this.reviewForm.reset({ calificacion: 5, comentario: '' });
        this.showForm.set(false);
        this.submitting.set(false);

        alert('¡Reseña enviada con éxito!');
      },
      error: (err) => {
        console.error('Error al enviar reseña:', err);
        alert('Error al enviar la reseña. Intenta de nuevo.');
        this.submitting.set(false);
      }
    });
  }

  /**
   * Seleccionar calificación (estrellas)
   */
  selectRating(rating: number): void {
    this.reviewForm.patchValue({ calificacion: rating });
  }

  /**
   * Generar array para las estrellas
   */
  getStarsArray(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < rating);
  }

  /**
   * Formatear fecha
   */
  formatDate(dateString: string | Date): string {
    try {
      // Si la fecha viene como array desde el backend [year, month, day, hour, minute, second]
      if (Array.isArray(dateString)) {
        const [year, month, day, hour = 0, minute = 0, second = 0] = dateString;
        // Los meses en JavaScript son 0-indexed, pero el backend envía 1-indexed
        const date = new Date(year, month - 1, day, hour, minute, second);
        return new Intl.DateTimeFormat('es-PE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(date);
      }
      
      // Si es una fecha normal
      const date = new Date(dateString);
      
      // Validar que la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Fecha no disponible';
      }
      
      return new Intl.DateTimeFormat('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error al formatear fecha:', error, dateString);
      return 'Fecha no disponible';
    }
  }

  /**
   * Obtener nombre completo del usuario de la reseña
   */
  getUserName(resena: ResenaModel): string {
    // Si viene el objeto usuario completo
    if (resena.usuario && resena.usuario.nombre && resena.usuario.apellido) {
      return `${resena.usuario.nombre} ${resena.usuario.apellido}`;
    }
    // Fallback: usar el usuario actual si es una reseña recién creada
    if (this.currentUser) {
      return `${this.currentUser.nombre} ${this.currentUser.apellido}`;
    }
    return 'Usuario';
  }

  /**
   * Obtener iniciales del usuario
   */
  getUserInitials(resena: ResenaModel): string {
    // Si viene el objeto usuario completo
    if (resena.usuario && resena.usuario.nombre && resena.usuario.apellido) {
      const nombre = resena.usuario.nombre || '';
      const apellido = resena.usuario.apellido || '';
      return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
    }
    // Fallback: usar el usuario actual si es una reseña recién creada
    if (this.currentUser) {
      return `${this.currentUser.nombre.charAt(0)}${this.currentUser.apellido.charAt(0)}`.toUpperCase();
    }
    return 'U';
  }

  /**
   * Calcular porcentaje de distribución
   */
  getPercentage(count: number): number {
    const total = this.stats()?.totalResenas ?? 0;
    return total > 0 ? (count / total) * 100 : 0;
  }

  /**
   * Obtener conteo de estrellas por nivel
   */
  getStarCount(stars: number): number {
    const dist = this.stats()?.distribucion;
    if (!dist) return 0;
    
    const key = `estrellas${stars}` as keyof typeof dist;
    return dist[key] ?? 0;
  }
}
