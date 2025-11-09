import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { LoginRequestDto, RegisterDto } from '../../models/Usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private returnUrl: string = '/';

  // Estado de la vista
  isLoginMode = signal(true);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  // Formularios
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor() {
    // Formulario de Login
    this.loginForm = this.fb.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Formulario de Registro
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      hashContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]],
      numeroTelefono: [''],
      direccion: [''],
      ciudad: [''],
      pais: [''],
      codigoPostal: ['']
    });
  }

  ngOnInit(): void {
    // Obtener returnUrl de query params (si existe)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Si ya está logueado, redirigir
    if (this.loginService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  /**
   * Alternar entre Login y Registro
   */
  toggleMode(): void {
    this.isLoginMode.update(mode => !mode);
    this.errorMessage.set(null);
    this.loginForm.reset();
    this.registerForm.reset();
  }

  /**
   * Alternar visibilidad de contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(show => !show);
  }

  /**
   * Submit Login
   */
  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const credentials: LoginRequestDto = this.loginForm.value;

    this.loginService.login(credentials).subscribe({
      next: (response) => {
        console.log('✅ Login exitoso:', response);
        
        if (response.success) {
          // Redirigir a returnUrl o según el rol
          if (this.returnUrl && this.returnUrl !== '/') {
            this.router.navigate([this.returnUrl]);
          } else if (response.usuario.rol === 'ADMIN' || response.usuario.rol === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.errorMessage.set(response.message || 'Credenciales inválidas');
          this.submitting.set(false);
        }
      },
      error: (err) => {
        console.error('❌ Error en login:', err);
        this.errorMessage.set(
          err.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
        );
        this.submitting.set(false);
      }
    });
  }

  /**
   * Submit Registro
   */
  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    // Validar que las contraseñas coincidan
    const password = this.registerForm.get('hashContrasena')?.value;
    const confirmPassword = this.registerForm.get('confirmarContrasena')?.value;

    if (password !== confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    // Preparar datos (remover confirmarContrasena y agregar rol por defecto)
    const { confirmarContrasena, ...userData } = this.registerForm.value;
    const registerData: RegisterDto = {
      ...userData,
      rol: 'USER' // Rol por defecto
    };

    this.loginService.register(registerData).subscribe({
      next: (usuario) => {
        console.log('✅ Registro exitoso:', usuario);
        
        // Auto-login después del registro
        const loginCredentials: LoginRequestDto = {
          correoElectronico: registerData.correoElectronico,
          contrasena: registerData.hashContrasena
        };

        this.loginService.login(loginCredentials).subscribe({
          next: () => {
            // Redirigir a returnUrl o home
            this.router.navigate([this.returnUrl]);
          },
          error: () => {
            // Si falla el auto-login, cambiar a modo login
            this.isLoginMode.set(true);
            this.errorMessage.set('Registro exitoso. Por favor inicia sesión.');
            this.submitting.set(false);
          }
        });
      },
      error: (err) => {
        console.error('❌ Error en registro:', err);
        this.errorMessage.set(
          err.error?.message || 'Error al registrarse. El correo puede estar en uso.'
        );
        this.submitting.set(false);
      }
    });
  }

  /**
   * Marcar todos los campos como touched para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.controls[key].markAsTouched();
    });
  }

  /**
   * Helpers para validación en template
   */
  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    
    return '';
  }
}
