import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NavbarComponent } from '../../layout/navbar/component/navbar.component/navbar.component';
import { FooterComponent } from '../../layout/footer/component/footer.component/footer.component';
import { BannerComponent } from '../Banner/banner.component/banner.component';
import { BrandComponent } from '../brand/brand.component/brand.component';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, FooterComponent, BannerComponent, BrandComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

}
