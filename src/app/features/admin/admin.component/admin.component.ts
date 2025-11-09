import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { LoginService } from '../../auth/services/login.service';

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
  private loginService = inject(LoginService);
  private router = inject(Router);

  sidebarOpen = signal(true);

  menuItems: MenuItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: '📦', label: 'Productos', route: '/admin/productos' },
    { icon: '🏷️', label: 'Categorías', route: '/admin/categorias' },
    { icon: '🏢', label: 'Marcas', route: '/admin/marcas' },
    { icon: '👥', label: 'Usuarios', route: '/admin/usuarios' },
  ];

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  logout(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.loginService.logout();
      this.router.navigate(['/']);
    }
  }
}
