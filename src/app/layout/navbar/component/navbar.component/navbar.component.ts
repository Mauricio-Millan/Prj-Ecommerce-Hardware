import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../../features/auth/services/login.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);

  cartItemsCount = signal(0);
  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);

  // Señales computadas
  currentUser = this.loginService.currentUser;
  isLoggedIn = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => {
    const user = this.currentUser();
    return user?.rol === 'ADMIN' || user?.rol === 'admin';
  });

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(isOpen => !isOpen);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(isOpen => !isOpen);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  onLogout(): void {
    this.loginService.logout();
    this.closeUserMenu();
    this.router.navigate(['/']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToAdmin(): void {
    this.router.navigate(['/admin']);
    this.closeUserMenu();
  }
}
