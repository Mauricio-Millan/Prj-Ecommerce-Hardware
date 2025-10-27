import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BrandService } from '../../../../products/services/brand.service';
import { AdminBrandService } from '../../../services/admin-brand.service';
import { BrandModel } from '../../../../products/models/brand.model';

@Component({
  selector: 'app-brand-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandListComponent implements OnInit {
  private brandService = inject(BrandService);
  private adminBrandService = inject(AdminBrandService);

  brands = signal<BrandModel[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading.set(true);
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando marcas:', err);
        this.loading.set(false);
      }
    });
  }

  deleteBrand(id: number, name: string): void {
    if (!confirm(`¿Estás seguro de eliminar la marca "${name}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    this.adminBrandService.deleteBrand(id).subscribe({
      next: () => {
        console.log('✅ Marca eliminada');
        this.loadBrands();
      },
      error: (err) => {
        console.error('❌ Error eliminando marca:', err);
        alert('Error al eliminar marca: ' + (err.error?.message || err.message));
      }
    });
  }
}
