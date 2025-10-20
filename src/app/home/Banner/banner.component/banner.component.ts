import { Component, signal, effect, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

interface Banner {
  id: number;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-banner',
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BannerComponent implements OnDestroy {
  private intervalId?: number;
  
  currentSlide = signal(0);
  
  banners: Banner[] = [
    {
      id: 1,
      image: 'assets/banners/banner1.webp',
      alt: 'Banner promocional 1'
    },
    {
      id: 2,
      image: 'assets/banners/banner2.webp',
      alt: 'Banner promocional 2'
    },
    {
      id: 3,
      image: 'assets/banners/banner3.png',
      alt: 'Banner promocional 3'
    }
  ];

  constructor() {
    this.startAutoplay();
  }

  startAutoplay(): void {
    this.intervalId = window.setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambia cada 5 segundos
  }

  stopAutoplay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide(): void {
    this.currentSlide.update(current => 
      current === this.banners.length - 1 ? 0 : current + 1
    );
  }

  prevSlide(): void {
    this.currentSlide.update(current => 
      current === 0 ? this.banners.length - 1 : current - 1
    );
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    this.stopAutoplay();
    this.startAutoplay(); // Reinicia el autoplay
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }
}
