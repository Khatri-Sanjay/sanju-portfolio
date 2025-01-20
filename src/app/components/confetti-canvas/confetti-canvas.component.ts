import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import confetti from 'canvas-confetti';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-confetti-canvas',
  imports: [],
  templateUrl: './confetti-canvas.component.html',
  standalone: true,
  styleUrl: './confetti-canvas.component.scss'
})
export class ConfettiCanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('confettiCanvas', { static: false }) confettiCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Browser-only code here
      this.initConfetti();
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Browser-only code here
      this.initConfetti();
    }
  }

  private initConfetti(): void {
    const canvas = this.confettiCanvas.nativeElement;
    if (canvas) {
      confetti.create(canvas, {
        resize: true, // will fit all screen sizes
        useWorker: true, // improves performance
      })();
    }
  }

  private launchConfetti(): void {
    const duration = 5000; // in milliseconds
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
      }

      confetti({
        particleCount: 50,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2,
        },
      });
    }, 250);
  }
}
