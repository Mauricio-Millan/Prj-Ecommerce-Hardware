import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
