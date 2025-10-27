import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BannerComponent } from '../Banner/banner.component/banner.component';
import { BrandComponent } from '../brand/brand.component/brand.component';

@Component({
  selector: 'app-home',
  imports: [BannerComponent, BrandComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

}
