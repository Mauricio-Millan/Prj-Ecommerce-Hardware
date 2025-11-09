import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component/home.component';
import { CatalogComponent } from './features/catalog/components/catalog.component/catalog.component';
import { LoginComponent } from './features/auth/components/login.component/login.component';
import { AdminComponent } from './features/admin/admin.component/admin.component';
import { DashboardComponent } from './features/admin/components/dashboard/dashboard.component/dashboard.component';
import { ProductListAdminComponent } from './features/admin/components/products/product-list-admin.component/product-list-admin.component';
import { ProductsEditComponent } from './features/admin/components/products/products-edit.component/products-edit.component';
import { CategoryListComponent } from './features/admin/components/category/category-list.component/category-list.component';
import { CategoryEditComponent } from './features/admin/components/category/category-edit.component/category-edit.component';
import { BrandListComponent } from './features/admin/components/brands/brand-list.component/brand-list.component';
import { BrandsEditComponent } from './features/admin/components/brands/brands-edit.component/brands-edit.component';
import { UserAdminComponent } from './features/admin/components/user/user-admin.component/user-admin.component';
import { UserEditComponent } from './features/admin/components/user/user-edit.component/user-edit.component';
import { ProductDetailsComponent } from './features/products/components/product-details.component/product-details.component';
import { CarritoComponent } from './features/catalog/components/carrito.component/carrito.component';
import { adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'catalogo',
    component: CatalogComponent
  },
  {
    path: 'producto/:id',
    component: ProductDetailsComponent
  },
  {
    path: 'carrito',
    component: CarritoComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],  // 🔒 Protegido con guard de admin
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'productos',
        component: ProductListAdminComponent
      },
      {
        path: 'productos/nuevo',
        component: ProductsEditComponent
      },
      {
        path: 'productos/editar/:id',
        component: ProductsEditComponent
      },
      {
        path: 'categorias',
        component: CategoryListComponent
      },
      {
        path: 'categorias/nueva',
        component: CategoryEditComponent
      },
      {
        path: 'categorias/editar/:id',
        component: CategoryEditComponent
      },
      {
        path: 'marcas',
        component: BrandListComponent
      },
      {
        path: 'marcas/nueva',
        component: BrandsEditComponent
      },
      {
        path: 'marcas/editar/:id',
        component: BrandsEditComponent
      },
      {
        path: 'usuarios',
        component: UserAdminComponent
      },
      {
        path: 'usuarios/nuevo',
        component: UserEditComponent
      },
      {
        path: 'usuarios/editar/:id',
        component: UserEditComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

