import { Component, signal, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminUserService } from '../../../services/admin-user.service';
import { Usuario } from '../../../../auth/models/Usuario.model';

@Component({
  selector: 'app-user-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-admin.component.html',
  styleUrl: './user-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAdminComponent implements OnInit {
  private adminUserService = inject(AdminUserService);
  private router = inject(Router);

  users = signal<Usuario[]>([]);
  loading = signal(true);
  selectedUser = signal<Usuario | null>(null);
  showDeleteModal = signal(false);

  // Filtros
  searchTerm = signal('');
  selectedRoleFilter = signal<string>('all');

  // Paginación
  currentPage = signal(1);
  pageSize = 10;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.adminUserService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.loading.set(false);
        alert('Error al cargar usuarios');
      }
    });
  }

  // Filtrar usuarios
  get filteredUsers(): Usuario[] {
    let filtered = this.users();

    // Filtro por búsqueda
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(user => 
        user.nombre.toLowerCase().includes(search) ||
        user.apellido.toLowerCase().includes(search) ||
        user.correoElectronico.toLowerCase().includes(search)
      );
    }

    // Filtro por rol
    const roleFilter = this.selectedRoleFilter();
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.rol === roleFilter);
    }

    return filtered;
  }

  // Paginación
  get paginatedUsers(): Usuario[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1); // Reset a primera página
  }

  onRoleFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedRoleFilter.set(value);
    this.currentPage.set(1);
  }

  navigateToCreate(): void {
    this.router.navigate(['/admin/usuarios/nuevo']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/admin/usuarios/editar', id]);
  }

  confirmDelete(user: Usuario): void {
    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.selectedUser.set(null);
    this.showDeleteModal.set(false);
  }

  deleteUser(): void {
    const user = this.selectedUser();
    if (!user) return;

    this.adminUserService.deleteUser(user.id).subscribe({
      next: () => {
        console.log('✅ Usuario eliminado:', user.id);
        this.loadUsers();
        this.cancelDelete();
        alert('Usuario eliminado exitosamente');
      },
      error: (err) => {
        console.error('❌ Error eliminando usuario:', err);
        alert('Error al eliminar usuario: ' + (err.error?.message || err.message));
      }
    });
  }

  getRoleBadgeClass(rol: string): string {
    switch(rol?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'USER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Getters para el template
  get adminCount(): number {
    return this.users().filter(u => u.rol === 'ADMIN').length;
  }

  get userCount(): number {
    return this.users().filter(u => u.rol === 'USER').length;
  }

  // Exponer Math al template
  Math = Math;
}
