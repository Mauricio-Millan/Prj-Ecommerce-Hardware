import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Brand {
  id: number;
  name: string;
  logo: string;
}

@Component({
  selector: 'app-brand',
  imports: [CommonModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandComponent {
  brands: Brand[] = [
    {
      id: 1,
      name: 'Marca 1',
      logo: 'assets/marcas/Marca1.webp'
    },
    {
      id: 2,
      name: 'Marca 2',
      logo: 'assets/marcas/marca2.png'
    },
    {
      id: 3,
      name: 'Marca 3',
      logo: 'assets/marcas/marca3.png'
    },
    {
      id: 4,
      name: 'Marca 4',
      logo: 'assets/marcas/marca4.png'
    },
    {
      id: 5,
      name: 'Marca 5',
      logo: 'assets/marcas/marca5.webp'
    },
    {
      id: 6,
      name: 'Marca 6',
      logo: 'assets/marcas/marca6.webp'
    },
    {
      id: 7,
      name: 'Marca 7',
      logo: 'assets/marcas/marca7.png'
    },
    {
      id: 8,
      name: 'Marca 8',
      logo: 'assets/marcas/marca8.webp'
    }
  ];

  // Duplicamos las marcas para crear el efecto de loop infinito
  get duplicatedBrands(): Brand[] {
    return [...this.brands, ...this.brands];
  }
}
