import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminUserService } from '../../../services/admin-user.service';
import { RegisterDto, Usuario } from '../../../../auth/models/Usuario.model';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminUserService = inject(AdminUserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm: FormGroup;
  submitting = signal(false);
  userId = signal<number | null>(null);
  isEditMode = signal(false);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor() {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      hashContrasena: ['', [Validators.minLength(6)]],
      confirmarContrasena: [''],
      rol: ['USER', Validators.required],
      numeroTelefono: [''],
      direccion: [''],
      ciudad: [''],
      pais: [''],
      codigoPostal: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId.set(+id);
      this.isEditMode.set(true);
      this.loadUser(+id);
      
      // En modo edición, la contraseña es opcional
      this.userForm.get('hashContrasena')?.clearValidators();
      this.userForm.get('hashContrasena')?.updateValueAndValidity();
    } else {
      // En modo creación, la contraseña es requerida
      this.userForm.get('hashContrasena')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('hashContrasena')?.updateValueAndValidity();
    }
  }

  loadUser(id: number): void {
    this.adminUserService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          nombre: user.nombre,
          apellido: user.apellido,
          correoElectronico: user.correoElectronico,
          rol: user.rol,
          numeroTelefono: user.numeroTelefono || '',
          direccion: user.direccion || '',
          ciudad: user.ciudad || '',
          pais: user.pais || '',
          codigoPostal: user.codigoPostal || ''
        });
      },
      error: (err) => {
        console.error('Error cargando usuario:', err);
        alert('Error al cargar usuario');
        this.router.navigate(['/admin/usuarios']);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(show => !show);
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      Object.keys(this.userForm.controls).forEach(key => {
        this.userForm.controls[key].markAsTouched();
      });
      return;
    }

    // Validar contraseñas si se ingresaron
    const password = this.userForm.get('hashContrasena')?.value;
    const confirmPassword = this.userForm.get('confirmarContrasena')?.value;

    if (password && password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.submitting.set(true);

    if (this.isEditMode()) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser(): void {
    const { confirmarContrasena, ...formData } = this.userForm.value;
    const userData: RegisterDto = formData;

    this.adminUserService.createUser(userData).subscribe({
      next: (user) => {
        console.log('✅ Usuario creado:', user);
        alert('Usuario creado exitosamente');
        this.router.navigate(['/admin/usuarios']);
      },
      error: (err) => {
        console.error('❌ Error creando usuario:', err);
        this.submitting.set(false);
        alert('Error al crear usuario: ' + (err.error?.message || 'El email puede estar en uso'));
      }
    });
  }

  updateUser(): void {
    const userId = this.userId();
    if (!userId) return;

    const { confirmarContrasena, hashContrasena, ...formData } = this.userForm.value;
    
    // Solo incluir contraseña si se ingresó una nueva
    const userData: Partial<Usuario> = hashContrasena 
      ? { ...formData, hashContrasena }
      : formData;

    this.adminUserService.updateUser(userId, userData).subscribe({
      next: (user) => {
        console.log('✅ Usuario actualizado:', user);
        alert('Usuario actualizado exitosamente');
        this.router.navigate(['/admin/usuarios']);
      },
      error: (err) => {
        console.error('❌ Error actualizando usuario:', err);
        this.submitting.set(false);
        alert('Error al actualizar usuario: ' + (err.error?.message || err.message));
      }
    });
  }

  cancelar(): void {
    if (confirm('¿Deseas cancelar? Los cambios no guardados se perderán.')) {
      this.router.navigate(['/admin/usuarios']);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    
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
