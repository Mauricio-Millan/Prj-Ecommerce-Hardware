import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../../products/services/category.service';
import { AdminCategoryService } from '../../../services/admin-category.service';
import { CategoryModel } from '../../../../products/models/category.model';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private adminCategoryService = inject(AdminCategoryService);

  categories = signal<CategoryModel[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading.set(true);
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
        this.loading.set(false);
      }
    });
  }

  deleteCategory(id: number, name: string): void {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${name}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    this.adminCategoryService.deleteCategory(id).subscribe({
      next: () => {
        console.log('✅ Categoría eliminada');
        this.loadCategories();
      },
      error: (err) => {
        console.error('❌ Error eliminando categoría:', err);
        alert('Error al eliminar categoría: ' + (err.error?.message || err.message));
      }
    });
  }
}
