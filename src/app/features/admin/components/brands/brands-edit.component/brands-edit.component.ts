import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminBrandService } from '../../../services/admin-brand.service';

@Component({
  selector: 'app-brand-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './brands-edit.component.html',
  styleUrl: './brands-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandsEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private adminBrandService = inject(AdminBrandService);

  brandForm!: FormGroup;
  loading = signal(false);
  submitting = signal(false);
  
  isEditMode = computed(() => !!this.route.snapshot.params['id']);
  brandId = computed(() => Number(this.route.snapshot.params['id']));

  ngOnInit(): void {
    this.initForm();
    if (this.isEditMode()) {
      this.loadBrand();
    }
  }

  initForm(): void {
    this.brandForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  loadBrand(): void {
    this.loading.set(true);
    this.adminBrandService.getBrandById(this.brandId()).subscribe({
      next: (brand) => {
        this.brandForm.patchValue(brand);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando marca:', err);
        this.loading.set(false);
        alert('Error al cargar marca');
      }
    });
  }

  onSubmit(): void {
    if (this.brandForm.invalid) {
      Object.keys(this.brandForm.controls).forEach(key => {
        this.brandForm.controls[key].markAsTouched();
      });
      return;
    }

    this.submitting.set(true);
    const formValue = this.brandForm.value;

    const operation = this.isEditMode()
      ? this.adminBrandService.updateBrand(this.brandId(), formValue)
      : this.adminBrandService.createBrand(formValue);

    operation.subscribe({
      next: () => {
        console.log('✅ Marca guardada');
        this.router.navigate(['/admin/marcas']);
      },
      error: (err) => {
        console.error('❌ Error guardando marca:', err);
        this.submitting.set(false);
        alert('Error: ' + (err.error?.message || err.message));
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/marcas']);
  }
}
