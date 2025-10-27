import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {
  sidebarOpen = signal(true);

  menuItems: MenuItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: '📦', label: 'Productos', route: '/admin/productos' },
    { icon: '🏷️', label: 'Categorías', route: '/admin/categorias' },
    { icon: '🏢', label: 'Marcas', route: '/admin/marcas' },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  logout(): void {
    console.log('Cerrando sesión...');
    // TODO: Implementar lógica de logout
  }
}
