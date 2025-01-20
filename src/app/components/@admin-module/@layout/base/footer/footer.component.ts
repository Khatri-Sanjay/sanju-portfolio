import {Component, inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {interval, Subject, takeUntil} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit, OnDestroy{
  currentYear = new Date().getFullYear();

  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private destroy$ = new Subject<void>();

  displayedText = signal('');
  isTyping = signal(false);

  readonly text = 'Designed & Powered by Sanjay Khatri';
  readonly typingSpeed = 100;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startTyping();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startTyping(): void {
    this.ngZone.runOutsideAngular(() => {
      let index = 0;
      this.isTyping.set(true);

      const typingInterval = interval(this.typingSpeed)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (index < this.text.length) {
            this.ngZone.run(() => {
              this.displayedText.update(value => value + this.text.charAt(index));
            });
            index++;
          } else {
            typingInterval.unsubscribe();
            this.ngZone.run(() => {
              this.isTyping.set(false);
            });

            setTimeout(() => {
              this.ngZone.run(() => {
                this.displayedText.set('');
                this.startTyping();
              });
            }, 5000);
          }
        });
    });
  }
}
