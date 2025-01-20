import { Directive, ElementRef, Input, Renderer2, OnInit, OnDestroy, NgZone } from '@angular/core';

export interface TooltipConfig {
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  showArrow?: boolean;
  maxWidth?: string;
  theme?: 'dark' | 'light';
}

@Directive({
  standalone: true,
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input('appTooltip') tooltipText = '';
  @Input() tooltipConfig: TooltipConfig = {
    position: 'top',
    delay: 200,
    showArrow: true,
    maxWidth: '200px',
    theme: 'dark'
  };

  private tooltipElement!: HTMLElement;
  private showTimeout?: number;
  private hideTimeout?: number;
  private resizeObserver!: ResizeObserver;
  private mutationObserver!: MutationObserver;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.setupListeners();
    this.addTooltipStyles();
    this.setupObservers();
  }

  ngOnDestroy(): void {
    this.clearTimeouts();
    this.removeObservers();
  }

  private setupListeners(): void {
    this.ngZone.runOutsideAngular(() => {
      this.renderer.listen(this.el.nativeElement, 'mouseenter', () => this.showTooltip());
      this.renderer.listen(this.el.nativeElement, 'mouseleave', () => this.hideTooltip());
      this.renderer.listen(this.el.nativeElement, 'focus', () => this.showTooltip());
      this.renderer.listen(this.el.nativeElement, 'blur', () => this.hideTooltip());
    });
  }

  private setupObservers(): void {
    // Observer for element size changes
    this.resizeObserver = new ResizeObserver(() => {
      if (this.tooltipElement) {
        this.updateTooltipPosition();
      }
    });
    this.resizeObserver.observe(this.el.nativeElement);

    // Observer for DOM mutations
    this.mutationObserver = new MutationObserver(() => {
      if (this.tooltipElement) {
        this.updateTooltipPosition();
      }
    });
    this.mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  private removeObservers(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  private showTooltip(): void {
    this.clearTimeouts();
    this.showTimeout = window.setTimeout(() => {
      if (!this.tooltipElement) {
        this.createTooltip();
        this.updateTooltipPosition();
        this.animateTooltip('show');
      }
    }, this.tooltipConfig.delay);
  }

  private hideTooltip(): void {
    this.clearTimeouts();
    this.hideTimeout = window.setTimeout(() => {
      if (this.tooltipElement) {
        this.animateTooltip('hide');
      }
    }, 100);
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
  }

  private createTooltip(): void {
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'custom-tooltip');
    this.renderer.addClass(this.tooltipElement, `theme-${this.tooltipConfig.theme}`);

    const innerContent = this.renderer.createElement('div');
    this.renderer.addClass(innerContent, 'tooltip-content');
    innerContent.textContent = this.tooltipText;
    this.renderer.appendChild(this.tooltipElement, innerContent);

    if (this.tooltipConfig.showArrow) {
      const arrow = this.renderer.createElement('div');
      this.renderer.addClass(arrow, 'tooltip-arrow');
      this.renderer.appendChild(this.tooltipElement, arrow);
    }

    this.renderer.appendChild(document.body, this.tooltipElement);
  }

  private updateTooltipPosition(): void {
    if (!this.tooltipElement) return;

    const hostRect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0;
    let left = 0;

    switch (this.tooltipConfig.position) {
      case 'bottom':
        top = hostRect.bottom + scrollY + 10;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        this.renderer.setAttribute(this.tooltipElement, 'data-position', 'bottom');
        break;
      case 'left':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.left + scrollX - tooltipRect.width - 10;
        this.renderer.setAttribute(this.tooltipElement, 'data-position', 'left');
        break;
      case 'right':
        top = hostRect.top + scrollY + (hostRect.height - tooltipRect.height) / 2;
        left = hostRect.right + scrollX + 10;
        this.renderer.setAttribute(this.tooltipElement, 'data-position', 'right');
        break;
      default: // top
        top = hostRect.top + scrollY - tooltipRect.height - 10;
        left = hostRect.left + scrollX + (hostRect.width - tooltipRect.width) / 2;
        this.renderer.setAttribute(this.tooltipElement, 'data-position', 'top');
    }

    // Keep tooltip within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
      left = viewportWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewportHeight - 10) {
      top = viewportHeight - tooltipRect.height - 10;
    }

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
  }

  private animateTooltip(action: 'show' | 'hide'): void {
    if (action === 'show') {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
      this.renderer.setStyle(this.tooltipElement, 'transform', 'scale(1)');
    } else {
      const onTransitionEnd = () => {
        if (this.tooltipElement) {
          this.renderer.removeChild(document.body, this.tooltipElement);
          this.tooltipElement = null!;
        }
      };

      this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
      this.renderer.setStyle(this.tooltipElement, 'transform', 'scale(0.9)');
      this.tooltipElement.addEventListener('transitionend', onTransitionEnd, { once: true });
    }
  }

  private addTooltipStyles(): void {
    const styles = `
      .custom-tooltip {
        position: fixed;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
        max-width: var(--tooltip-max-width, 200px);
      }

      .tooltip-content {
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        line-height: 1.4;
        text-align: center;
        white-space: normal;
        word-wrap: break-word;
      }

      .tooltip-arrow {
        position: absolute;
        width: 8px;
        height: 8px;
        transform: rotate(45deg);
      }

      /* Theme: Dark */
      .custom-tooltip.theme-dark .tooltip-content {
        background-color: rgba(33, 33, 33, 0.95);
        color: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .custom-tooltip.theme-dark .tooltip-arrow {
        background-color: rgba(33, 33, 33, 0.95);
      }

      /* Theme: Light */
      .custom-tooltip.theme-light .tooltip-content {
        background-color: rgba(255, 255, 255, 0.95);
        color: #333333;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      .custom-tooltip.theme-light .tooltip-arrow {
        background-color: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.1);
      }

      /* Position-specific styles */
      .custom-tooltip[data-position="top"] .tooltip-arrow {
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
      }

      .custom-tooltip[data-position="bottom"] .tooltip-arrow {
        top: -4px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
      }

      .custom-tooltip[data-position="left"] .tooltip-arrow {
        right: -4px;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
      }

      .custom-tooltip[data-position="right"] .tooltip-arrow {
        left: -4px;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
      }
    `;

    const styleElement = this.renderer.createElement('style');
    styleElement.textContent = styles;
    this.renderer.appendChild(document.head, styleElement);
  }
}
