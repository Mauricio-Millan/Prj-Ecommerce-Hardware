import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminCategoryService } from '../../../services/admin-category.service';

@Component({
  selector: 'app-category-edit',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private adminCategoryService = inject(AdminCategoryService);

  categoryForm!: FormGroup;
  loading = signal(false);
  submitting = signal(false);
  
  isEditMode = computed(() => !!this.route.snapshot.params['id']);
  categoryId = computed(() => Number(this.route.snapshot.params['id']));

  ngOnInit(): void {
    this.initForm();
    if (this.isEditMode()) {
      this.loadCategory();
    }
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadCategory(): void {
    this.loading.set(true);
    this.adminCategoryService.getCategoryById(this.categoryId()).subscribe({
      next: (category) => {
        this.categoryForm.patchValue(category);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando categoría:', err);
        this.loading.set(false);
        alert('Error al cargar categoría');
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.controls[key].markAsTouched();
      });
      return;
    }

    this.submitting.set(true);
    const formValue = this.categoryForm.value;

    const operation = this.isEditMode()
      ? this.adminCategoryService.updateCategory(this.categoryId(), formValue)
      : this.adminCategoryService.createCategory(formValue);

    operation.subscribe({
      next: () => {
        console.log('✅ Categoría guardada');
        this.router.navigate(['/admin/categorias']);
      },
      error: (err) => {
        console.error('❌ Error guardando categoría:', err);
        this.submitting.set(false);
        alert('Error: ' + (err.error?.message || err.message));
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/categorias']);
  }
}
